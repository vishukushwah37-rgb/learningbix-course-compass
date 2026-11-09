import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Heart, Minus, PackageCheck, Plus, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { ProductCard, Stars } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD, discountPercent, formatINR } from "@/lib/pricing";
import { productQuery } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params, context }) => {
    const res = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!res.product) throw notFound();
    return { name: res.product.name, short: res.product.short_description ?? "" };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? pageMeta(`${loaderData.name} Kit`, loaderData.short) : [{ title: "Product not found – LearningBIX" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const p = data.product!;
  const { add, wishlist, toggleWishlist } = useCart();
  const navigate = useNavigate();
  const images = [p.image_url, ...[...(p.product_images ?? [])].sort((a, b) => a.position - b.position).map((i) => i.url)].filter((u, i, a): u is string => Boolean(u) && a.indexOf(u) === i);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const stock = (Array.isArray(p.inventory) ? p.inventory[0]?.stock : (p.inventory as { stock: number } | null)?.stock) ?? 0;
  const price = Number(p.price);
  const mrp = Number(p.mrp);
  const off = discountPercent(price, mrp);
  const specs = (p.specifications && typeof p.specifications === "object" && !Array.isArray(p.specifications) ? p.specifications : {}) as Record<string, string>;
  const item = { productId: p.id, slug: p.slug, name: p.name, price, mrp, image: p.image_url };
  const saved = wishlist.includes(p.id);

  return (
    <>
      <Section tone="white" className="pt-8 sm:pt-10 lg:pt-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary">Home</a> / <a href="/shop" className="hover:text-primary">Shop</a> / <span className="text-foreground">{p.name}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="group overflow-hidden rounded-[2rem] border bg-surface">
              <img src={images[active] ?? ""} alt={p.name} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {images.map((u, i) => (
                  <button key={u} onClick={() => setActive(i)} aria-label={`Image ${i + 1}`} className={cn("size-20 overflow-hidden rounded-xl border-2", i === active ? "border-primary" : "border-transparent opacity-70")}>
                    <img src={u} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            {p.product_categories && <span className="text-sm font-semibold uppercase tracking-wide text-primary">{p.product_categories.name}</span>}
            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{p.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Stars value={Number(p.rating)} /> {Number(p.rating).toFixed(1)} · {p.reviews_count} reviews {p.age_group && <>· Age {p.age_group}</>}
            </div>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl font-extrabold">{formatINR(price)}</span>
              {mrp > price && <span className="text-lg text-muted-foreground line-through">{formatINR(mrp)}</span>}
              {off > 0 && <span className="rounded-full bg-sun px-2.5 py-1 text-xs font-bold text-sun-foreground">{off}% OFF</span>}
            </div>
            <p className="mt-5 text-muted-foreground">{p.short_description}</p>
            <p className={cn("mt-4 text-sm font-semibold", stock > 0 ? "text-mint" : "text-destructive")}>
              {stock > 10 ? "In stock" : stock > 0 ? `Only ${stock} left` : "Out of stock"}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border bg-card">
                <Button variant="ghost" size="icon" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus /></Button>
                <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
                <Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(Math.max(1, stock), q + 1))}><Plus /></Button>
              </div>
              <Button size="lg" disabled={stock < 1} onClick={() => add(item, qty)}>Add to Cart</Button>
              <Button size="lg" variant="brand" disabled={stock < 1} onClick={() => { add(item, qty); void navigate({ to: "/cart" }); }}>Buy Now</Button>
              <Button size="icon" variant="outline" aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleWishlist(p.id, p.name)}>
                <Heart className={cn(saved && "fill-destructive text-destructive")} />
              </Button>
            </div>
            <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
              <li className="flex items-center gap-2 rounded-2xl bg-secondary p-3"><Truck className="size-5 text-primary" />Free shipping over {formatINR(FREE_SHIPPING_THRESHOLD)}</li>
              <li className="flex items-center gap-2 rounded-2xl bg-secondary p-3"><PackageCheck className="size-5 text-primary" />7-day replacement</li>
              <li className="flex items-center gap-2 rounded-2xl bg-secondary p-3"><ShieldCheck className="size-5 text-primary" />Child-safe parts</li>
            </ul>
          </Reveal>
        </div>

        <Tabs defaultValue="description" className="mt-14">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="box">In the box</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="max-w-3xl pt-4 leading-relaxed text-muted-foreground">{p.description}</TabsContent>
          <TabsContent value="specs" className="pt-4">
            <dl className="grid max-w-2xl overflow-hidden rounded-2xl border sm:grid-cols-2">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="border-b p-4 sm:odd:border-r"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold">{String(v)}</dd></div>
              ))}
            </dl>
          </TabsContent>
          <TabsContent value="box" className="pt-4">
            <ul className="grid max-w-2xl gap-2 sm:grid-cols-2">
              {p.box_contents.map((b) => <li key={b} className="flex items-center gap-2 rounded-xl border bg-card p-3 text-sm"><PackageCheck className="size-4 text-mint" />{b}</li>)}
            </ul>
          </TabsContent>
        </Tabs>
      </Section>

      {data.related.length > 0 && (
        <Section>
          <SectionHeading eyebrow="You may also like" title="Related kits" />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.related.map((r) => <StaggerItem key={r.id}><ProductCard product={r} /></StaggerItem>)}
          </Stagger>
        </Section>
      )}
    </>
  );
}
