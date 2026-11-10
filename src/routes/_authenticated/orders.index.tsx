import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { myOrdersQuery } from "@/lib/orders.queries";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, statusTone, TONE_CLASS } from "@/lib/order-status";
import { formatINR } from "@/lib/pricing";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/orders/")({
  head: () => ({ meta: [...pageMeta("My Orders", "Track your LearningBIX kit orders."), { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(myOrdersQuery()),
  component: Orders,
});

function Orders() {
  const { data: orders } = useSuspenseQuery(myOrdersQuery());
  return (
    <Section className="pt-10 sm:pt-12">
      <h1 className="text-3xl font-extrabold sm:text-4xl">My orders</h1>
      {orders.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed p-12 text-center">
          <Package className="mx-auto size-12 text-muted-foreground" />
          <p className="mt-3 font-semibold">No orders yet</p>
          <Button asChild className="mt-4"><Link to="/shop">Shop kits</Link></Button>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((o) => (
            <li key={o.id}>
              <Link to="/orders/$id" params={{ id: o.id }} search={{}} className="flex flex-wrap items-center gap-4 rounded-3xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary">
                <div className="flex -space-x-3">
                  {o.order_items.slice(0, 3).map((it, i) => <img key={i} src={it.image_url ?? ""} alt="" className="size-14 rounded-xl border-2 border-card object-cover" />)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{o.order_number}</div>
                  <div className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {o.order_items.reduce((n, i) => n + i.quantity, 0)} items</div>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", TONE_CLASS[statusTone(o.status)])}>{ORDER_STATUS_LABEL[o.status] ?? o.status}</span>
                <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", TONE_CLASS[statusTone(o.payment_status)])}>{PAYMENT_STATUS_LABEL[o.payment_status] ?? o.payment_status}</span>
                <span className="font-bold">{formatINR(o.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
