import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { retryPayment, verifyPayment } from "@/lib/orders.functions";
import { orderQuery } from "@/lib/orders.queries";
import { ORDER_STATUS_LABEL, ORDER_STEPS, PAYMENT_STATUS_LABEL, statusTone, TONE_CLASS } from "@/lib/order-status";
import { formatINR } from "@/lib/pricing";
import { payWithRazorpay } from "@/lib/razorpay-client";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/orders/$id")({
  validateSearch: (s: Record<string, unknown>): { placed?: boolean } => (s.placed === true || s.placed === "true" ? { placed: true } : {}),
  loader: async ({ params, context }) => {
    const order = await context.queryClient.ensureQueryData(orderQuery(params.id));
    if (!order) throw notFound();
  },
  head: () => ({ meta: [...pageMeta("Order Details", "Status and details of your LearningBIX order."), { name: "robots", content: "noindex" }] }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { placed } = Route.useSearch();
  const { data: o } = useSuspenseQuery(orderQuery(id));
  const qc = useQueryClient();
  const [paying, setPaying] = useState(false);
  if (!o) return null;
  const stepIndex = ORDER_STEPS.indexOf(o.status as (typeof ORDER_STEPS)[number]);
  const needsPayment = o.payment_method === "razorpay" && o.payment_status !== "paid" && o.status !== "cancelled";

  async function pay() {
    if (!o) return;
    setPaying(true);
    try {
      const rp = await retryPayment({ data: { orderId: o.id } });
      const proof = await payWithRazorpay({ key: rp.keyId, amount: rp.amount, currency: rp.currency, order_id: rp.orderId, name: "LearningBIX", description: `Order ${o.order_number}`, prefill: { name: o.customer_name ?? undefined, email: o.customer_email ?? undefined, contact: o.customer_phone ?? undefined }, theme: { color: "#2563EB" } });
      if (proof) {
        await verifyPayment({ data: { orderId: o.id, razorpayOrderId: proof.razorpay_order_id, razorpayPaymentId: proof.razorpay_payment_id, razorpaySignature: proof.razorpay_signature } });
        toast.success("Payment received. Thank you!");
        await qc.invalidateQueries({ queryKey: ["order", o.id] });
        void qc.invalidateQueries({ queryKey: ["my-orders"] });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <Section className="pt-10 sm:pt-12">
      {placed && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3 rounded-3xl bg-mint/15 p-5">
          <CheckCircle2 className="size-8 text-mint" />
          <div><div className="font-bold">Thank you! Your order is in.</div><div className="text-sm text-muted-foreground">We'll notify you as it moves along.</div></div>
        </motion.div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold">Order {o.order_number}</h1>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", TONE_CLASS[statusTone(o.status)])}>{ORDER_STATUS_LABEL[o.status] ?? o.status}</span>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", TONE_CLASS[statusTone(o.payment_status)])}>{PAYMENT_STATUS_LABEL[o.payment_status] ?? o.payment_status}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Placed {new Date(o.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>

      {o.status !== "cancelled" && (
        <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Order progress">
          {ORDER_STEPS.map((s, i) => {
            const done = stepIndex >= i;
            return (
              <li key={s} className="flex flex-col items-center text-center">
                <span className={cn("grid size-10 place-items-center rounded-full border-2 transition", done ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                  {done ? <Check className="size-5" /> : i + 1}
                </span>
                <span className={cn("mt-2 text-xs font-semibold sm:text-sm", done ? "text-foreground" : "text-muted-foreground")}>{ORDER_STATUS_LABEL[s]}</span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-3">
          {o.order_items.map((it) => (
            <li key={it.id} className="flex items-center gap-4 rounded-3xl border bg-card p-4">
              <img src={it.image_url ?? ""} alt="" className="size-16 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1"><div className="font-semibold">{it.product_name}</div><div className="text-sm text-muted-foreground">{formatINR(it.price)} × {it.quantity}</div></div>
              <span className="font-bold">{formatINR(Number(it.price) * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <aside className="space-y-4">
          <div className="rounded-3xl border bg-card p-5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(o.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{Number(o.shipping) ? formatINR(o.shipping) : "Free"}</dd></div>
              <div className="flex justify-between border-t pt-2 text-base font-bold"><dt>Total</dt><dd>{formatINR(o.total)}</dd></div>
              <div className="flex justify-between text-muted-foreground"><dt>Payment</dt><dd>{o.payment_method === "cod" ? "Cash on delivery" : "Online"}</dd></div>
            </dl>
            {needsPayment && <Button variant="brand" className="mt-4 w-full" onClick={pay} disabled={paying}>{paying ? <Loader2 className="animate-spin" /> : `Pay ${formatINR(o.total)}`}</Button>}
          </div>
          <div className="rounded-3xl border bg-card p-5 text-sm">
            <h2 className="font-bold">Delivery address</h2>
            <p className="mt-2 text-muted-foreground">{o.customer_name}<br />{o.address_line}<br />{o.city}, {o.state} {o.pincode}<br />{o.customer_phone}</p>
          </div>
          <Button asChild variant="outline" className="w-full"><Link to="/orders">All orders</Link></Button>
        </aside>
      </div>
    </Section>
  );
}
