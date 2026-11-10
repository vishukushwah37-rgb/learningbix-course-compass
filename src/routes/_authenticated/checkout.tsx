import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, CreditCard, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { FormField } from "@/components/site/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { createOrder, verifyPayment } from "@/lib/orders.functions";
import { paymentConfigQuery } from "@/lib/orders.queries";
import { formatINR } from "@/lib/pricing";
import { payWithRazorpay } from "@/lib/razorpay-client";
import { checkoutSchema, type CheckoutInput } from "@/lib/schemas";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({ meta: [...pageMeta("Checkout", "Enter delivery details and pay for your LearningBIX order."), { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

function Checkout() {
  const { items, hydrated, totals, clear } = useCart();
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: config } = useQuery(paymentConfigQuery());
  const online = config?.razorpay ?? false;
  const [busy, setBusy] = useState(false);
  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customer_name: "", customer_email: "", customer_phone: "", address_line: "", city: "", state: "", pincode: "", payment_method: "cod" },
  });
  const method = form.watch("payment_method");
  const e = form.formState.errors;

  useEffect(() => {
    if (!profile && !user) return;
    const cur = form.getValues();
    form.reset({
      ...cur,
      customer_name: cur.customer_name || profile?.full_name || "",
      customer_email: cur.customer_email || profile?.email || user?.email || "",
      customer_phone: cur.customer_phone || profile?.phone || "",
      city: cur.city || profile?.city || "",
      state: cur.state || profile?.state || "",
    });
  }, [profile, user, form]);

  useEffect(() => {
    if (online) form.setValue("payment_method", "razorpay");
  }, [online, form]);

  async function onSubmit(values: CheckoutInput) {
    setBusy(true);
    try {
      const res = await createOrder({ data: { items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })), customer: values } });
      clear();
      void qc.invalidateQueries({ queryKey: ["my-orders"] });
      if (res.razorpay) {
        const proof = await payWithRazorpay({
          key: res.razorpay.keyId,
          amount: res.razorpay.amount,
          currency: res.razorpay.currency,
          order_id: res.razorpay.orderId,
          name: "LearningBIX",
          description: `Order ${res.orderNumber}`,
          prefill: { name: values.customer_name, email: values.customer_email, contact: values.customer_phone },
          theme: { color: "#2563EB" },
        });
        if (proof) {
          await verifyPayment({ data: { orderId: res.orderId, razorpayOrderId: proof.razorpay_order_id, razorpayPaymentId: proof.razorpay_payment_id, razorpaySignature: proof.razorpay_signature } });
          toast.success("Payment received. Thank you!");
        } else {
          toast("Payment not completed. You can pay from your order page.");
        }
      } else {
        toast.success(`Order ${res.orderNumber} placed!`);
      }
      void navigate({ to: "/orders/$id", params: { id: res.orderId }, search: { placed: true } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!hydrated) return <Section><div className="h-64 animate-pulse rounded-3xl bg-muted" /></Section>;
  if (!items.length && !busy) {
    return (
      <Section>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Button asChild className="mt-4"><Link to="/shop">Go to the shop</Link></Button>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-10 sm:pt-12">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Checkout</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <fieldset className="rounded-[2rem] border bg-card p-6 shadow-soft">
            <legend className="px-2 text-lg font-bold">Delivery details</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name" htmlFor="customer_name" error={e.customer_name?.message}><Input id="customer_name" autoComplete="name" {...form.register("customer_name")} /></FormField>
              <FormField label="Phone" htmlFor="customer_phone" error={e.customer_phone?.message}><Input id="customer_phone" type="tel" autoComplete="tel" {...form.register("customer_phone")} /></FormField>
              <FormField label="Email" htmlFor="customer_email" error={e.customer_email?.message} className="sm:col-span-2"><Input id="customer_email" type="email" autoComplete="email" {...form.register("customer_email")} /></FormField>
              <FormField label="Address" htmlFor="address_line" error={e.address_line?.message} className="sm:col-span-2"><Input id="address_line" autoComplete="street-address" placeholder="House no., street, area" {...form.register("address_line")} /></FormField>
              <FormField label="City" htmlFor="city" error={e.city?.message}><Input id="city" autoComplete="address-level2" {...form.register("city")} /></FormField>
              <FormField label="State" htmlFor="state" error={e.state?.message}><Input id="state" autoComplete="address-level1" {...form.register("state")} /></FormField>
              <FormField label="PIN code" htmlFor="pincode" error={e.pincode?.message}><Input id="pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" {...form.register("pincode")} /></FormField>
            </div>
          </fieldset>
          <fieldset className="rounded-[2rem] border bg-card p-6 shadow-soft">
            <legend className="px-2 text-lg font-bold">Payment</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <PayOption active={method === "razorpay"} disabled={!online} onClick={() => form.setValue("payment_method", "razorpay")} icon={CreditCard} title="Pay online" text={online ? "UPI, cards, net banking (Razorpay)" : "Coming soon"} />
              <PayOption active={method === "cod"} onClick={() => form.setValue("payment_method", "cod")} icon={Banknote} title="Cash on delivery" text="Pay when your kit arrives" />
            </div>
          </fieldset>
        </div>
        <aside className="h-fit rounded-[2rem] border bg-card p-6 shadow-soft lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Your order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.productId} className="flex items-center gap-3 text-sm">
                <img src={i.image ?? ""} alt="" className="size-12 rounded-xl object-cover" />
                <span className="min-w-0 flex-1 truncate">{i.name} × {i.quantity}</span>
                <span className="font-semibold">{formatINR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(totals.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{totals.shipping ? formatINR(totals.shipping) : "Free"}</dd></div>
            <div className="flex justify-between border-t pt-3 text-base font-bold"><dt>Total</dt><dd>{formatINR(totals.total)}</dd></div>
          </dl>
          <Button type="submit" variant="brand" size="lg" className="mt-6 w-full" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <><Lock /> {method === "razorpay" ? `Pay ${formatINR(totals.total)}` : "Place order"}</>}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Final prices and stock are confirmed when you place the order.</p>
        </aside>
      </form>
    </Section>
  );
}

function PayOption({ active, disabled, onClick, icon: Icon, title, text }: { active: boolean; disabled?: boolean; onClick: () => void; icon: typeof Banknote; title: string; text: string }) {
  return (
    <button type="button" disabled={disabled} aria-pressed={active} onClick={onClick} className={cn("flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50", active ? "border-primary bg-primary/5" : "hover:border-primary/50")}>
      <Icon className={cn("mt-0.5 size-5", active ? "text-primary" : "text-muted-foreground")} />
      <span><span className="block font-semibold">{title}</span><span className="text-sm text-muted-foreground">{text}</span></span>
    </button>
  );
}
