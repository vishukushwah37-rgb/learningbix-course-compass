import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD, formatINR } from "@/lib/pricing";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [...pageMeta("Your Cart", "Review the kits in your LearningBIX cart and check out."), { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, hydrated, totals, setQuantity, remove } = useCart();
  const { user } = useAuth();
  const toFree = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  if (!hydrated) return <Section><div className="h-64 animate-pulse rounded-3xl bg-muted" /></Section>;

  if (!items.length) {
    return (
      <Section>
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-secondary text-primary"><ShoppingBag className="size-9" /></span>
          <h1 className="mt-6 text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Find a kit your child will love building.</p>
          <Button asChild variant="brand" size="lg" className="mt-6"><Link to="/shop">Browse the shop</Link></Button>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-10 sm:pt-12">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((i) => (
              <motion.li key={i.productId} layout exit={{ opacity: 0, x: -40 }} className="flex gap-4 rounded-3xl border bg-card p-4 shadow-soft">
                <Link to="/shop/$slug" params={{ slug: i.slug }} className="shrink-0"><img src={i.image ?? ""} alt={i.name} className="size-24 rounded-2xl object-cover sm:size-28" /></Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link to="/shop/$slug" params={{ slug: i.slug }} className="font-bold hover:text-primary">{i.name}</Link>
                    <Button variant="ghost" size="icon" aria-label={`Remove ${i.name}`} onClick={() => remove(i.productId)}><Trash2 className="text-destructive" /></Button>
                  </div>
                  <div className="text-sm text-muted-foreground">{formatINR(i.price)} each</div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border">
                      <Button variant="ghost" size="icon" className="size-8" aria-label="Decrease quantity" onClick={() => setQuantity(i.productId, i.quantity - 1)} disabled={i.quantity <= 1}><Minus /></Button>
                      <span className="w-8 text-center text-sm font-semibold">{i.quantity}</span>
                      <Button variant="ghost" size="icon" className="size-8" aria-label="Increase quantity" onClick={() => setQuantity(i.productId, i.quantity + 1)}><Plus /></Button>
                    </div>
                    <span className="font-bold">{formatINR(i.price * i.quantity)}</span>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <aside className="h-fit rounded-[2rem] border bg-card p-6 shadow-soft lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Order summary</h2>
          {toFree > 0 ? (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-sun/15 p-3 text-sm"><Truck className="size-4" />Add {formatINR(toFree)} more for free shipping</p>
          ) : (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-mint/15 p-3 text-sm font-medium"><Truck className="size-4" />You've unlocked free shipping</p>
          )}
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(totals.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{totals.shipping ? formatINR(totals.shipping) : "Free"}</dd></div>
            <div className="flex justify-between border-t pt-3 text-base font-bold"><dt>Total</dt><dd>{formatINR(totals.total)}</dd></div>
          </dl>
          <Button asChild variant="brand" size="lg" className="mt-6 w-full">
            {user ? <Link to="/checkout">Proceed to checkout</Link> : <Link to="/login" search={{ redirect: "/checkout" }}>Sign in to check out</Link>}
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full"><Link to="/shop">Continue shopping</Link></Button>
        </aside>
      </div>
    </Section>
  );
}
