import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { computeTotals } from "./pricing";
import { checkoutSchema } from "./schemas";

/** Whether online (Razorpay) payment is switched on. The key id is public by design. */
export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  return { razorpay: Boolean(keyId && process.env["RAZORPAY_KEY_SECRET"]) };
});

const createOrderSchema = z.object({
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(99) })).min(1).max(50),
  customer: checkoutSchema,
});

export type RazorpayStart = { orderId: string; amount: number; currency: string; keyId: string };

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => createOrderSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { customer } = data;

    // Merge duplicate lines
    const qty = new Map<string, number>();
    for (const i of data.items) qty.set(i.productId, Math.min(99, (qty.get(i.productId) ?? 0) + i.quantity));
    const ids = [...qty.keys()];

    const [{ data: products }, { data: stock }] = await Promise.all([
      supabase.from("products").select("id, name, price, image_url, is_active").in("id", ids),
      supabase.from("inventory").select("product_id, stock").in("product_id", ids),
    ]);

    const lines = ids.map((id) => {
      const p = products?.find((x) => x.id === id);
      if (!p || !p.is_active) throw new Error("One of the items in your cart is no longer available.");
      const available = stock?.find((s) => s.product_id === id)?.stock ?? 0;
      const quantity = qty.get(id) ?? 1;
      if (quantity > available) throw new Error(available > 0 ? `Only ${available} left of ${p.name}.` : `${p.name} is out of stock.`);
      return { productId: id, name: p.name, image: p.image_url, price: Number(p.price), quantity, available };
    });

    // Prices always come from the database, never from the browser.
    const totals = computeTotals(lines);
    const online = customer.payment_method === "razorpay";

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (online) {
      const { razorpayKeys } = await import("./razorpay.server");
      if (!razorpayKeys()) throw new Error("Online payment isn't available yet. Please choose Cash on Delivery.");
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        status: online ? "pending" : "placed",
        payment_status: "pending",
        payment_method: customer.payment_method,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        total: totals.total,
        customer_name: customer.customer_name,
        customer_email: customer.customer_email,
        customer_phone: customer.customer_phone,
        address_line: customer.address_line,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      })
      .select("id, order_number")
      .single();
    if (error || !order) {
      console.error(error);
      throw new Error("We couldn't place your order. Please try again.");
    }

    await supabaseAdmin.from("order_items").insert(
      lines.map((l) => ({ order_id: order.id, product_id: l.productId, product_name: l.name, image_url: l.image, price: l.price, quantity: l.quantity })),
    );

    if (!online) {
      await Promise.all([
        ...lines.map((l) => supabaseAdmin.from("inventory").update({ stock: Math.max(0, l.available - l.quantity) }).eq("product_id", l.productId)),
        supabaseAdmin.from("payments").insert({ order_id: order.id, user_id: userId, purpose: "order", amount: totals.total, provider: "cod", method: "cod", status: "pending", description: `Order ${order.order_number}` }),
        supabaseAdmin.from("notifications").insert({ user_id: userId, title: `Order ${order.order_number} placed`, body: "Pay in cash when your kit arrives.", link: `/orders/${order.id}` }),
      ]);
      return { orderId: order.id, orderNumber: order.order_number, razorpay: null as RazorpayStart | null };
    }

    const razorpay = await startRazorpayFor(order.id, order.order_number, totals.total, userId);
    return { orderId: order.id, orderNumber: order.order_number, razorpay };
  });

async function startRazorpayFor(orderId: string, orderNumber: string, total: number, userId: string): Promise<RazorpayStart> {
  const { createRazorpayOrder } = await import("./razorpay.server");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const rp = await createRazorpayOrder(total, orderNumber);
  await supabaseAdmin.from("orders").update({ razorpay_order_id: rp.id }).eq("id", orderId);
  await supabaseAdmin.from("payments").insert({
    order_id: orderId,
    user_id: userId,
    purpose: "order",
    amount: total,
    provider: "razorpay",
    provider_order_id: rp.id,
    status: "pending",
    description: `Order ${orderNumber}`,
  });
  return { orderId: rp.id, amount: rp.amount, currency: rp.currency, keyId: rp.keyId };
}

/** Start (or retry) online payment for one of the caller's unpaid orders. */
export const retryPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ orderId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase
      .from("orders")
      .select("id, user_id, order_number, total, payment_status, payment_method, status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order || order.user_id !== context.userId) throw new Error("Order not found.");
    if (order.payment_method !== "razorpay" || order.payment_status === "paid" || order.status === "cancelled") throw new Error("This order doesn't need payment.");
    return startRazorpayFor(order.id, order.order_number, Number(order.total), context.userId);
  });

export const verifyPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        razorpayOrderId: z.string().min(5).max(64),
        razorpayPaymentId: z.string().min(5).max(64),
        razorpaySignature: z.string().min(10).max(256),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase
      .from("orders")
      .select("id, user_id, order_number, razorpay_order_id, payment_status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order || order.user_id !== context.userId || order.razorpay_order_id !== data.razorpayOrderId) throw new Error("Order not found.");
    if (order.payment_status === "paid") return { ok: true };

    const { verifyRazorpaySignature } = await import("./razorpay.server");
    if (!verifyRazorpaySignature(data.razorpayOrderId, data.razorpayPaymentId, data.razorpaySignature)) {
      throw new Error("We couldn't confirm this payment. If money was deducted, contact support with your order number.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("orders").update({ payment_status: "paid", status: "confirmed" }).eq("id", order.id);
    await supabaseAdmin
      .from("payments")
      .update({ status: "paid", provider_payment_id: data.razorpayPaymentId, paid_at: new Date().toISOString(), method: "razorpay" })
      .eq("provider_order_id", data.razorpayOrderId);

    const { data: items } = await supabaseAdmin.from("order_items").select("product_id, quantity").eq("order_id", order.id);
    for (const it of items ?? []) {
      if (!it.product_id) continue;
      const { data: inv } = await supabaseAdmin.from("inventory").select("stock").eq("product_id", it.product_id).maybeSingle();
      if (inv) await supabaseAdmin.from("inventory").update({ stock: Math.max(0, inv.stock - it.quantity) }).eq("product_id", it.product_id);
    }
    return { ok: true };
  });
