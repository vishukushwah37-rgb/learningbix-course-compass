import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Heart, Signal, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { discountPercent, formatINR } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export type ProductLite = {
  id: string;
  slug: string;
  name: string;
  short_description?: string | null;
  price: number;
  mrp: number;
  rating: number;
  reviews_count?: number;
  image_url: string | null;
  age_group?: string | null;
  product_categories?: { name: string; slug: string } | null;
};

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("size-3.5", i <= Math.round(value) ? "fill-sun text-sun" : "text-border")} />
      ))}
    </span>
  );
}

export function ProductCard({ product }: { product: ProductLite }) {
  const { add, wishlist, toggleWishlist } = useCart();
  const price = Number(product.price);
  const mrp = Number(product.mrp);
  const off = discountPercent(price, mrp);
  const saved = wishlist.includes(product.id);
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-soft">
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Link to="/shop/$slug" params={{ slug: product.slug }} aria-label={product.name}>
          <img src={product.image_url ?? ""} alt={product.name} loading="lazy" width={1024} height={1024} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-sun px-2.5 py-1 text-xs font-bold text-sun-foreground">{off}% OFF</span>}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id, product.name)}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-surface/90 shadow-soft transition hover:scale-110"
        >
          <Heart className={cn("size-4", saved ? "fill-destructive text-destructive" : "text-foreground")} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {product.product_categories && <span className="text-xs font-semibold uppercase tracking-wide text-primary">{product.product_categories.name}</span>}
        <h3 className="mt-1 font-display text-lg font-bold">
          <Link to="/shop/$slug" params={{ slug: product.slug }} className="hover:text-primary">{product.name}</Link>
        </h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Stars value={Number(product.rating)} />
          {Number(product.rating).toFixed(1)}
          {product.reviews_count ? <span>({product.reviews_count})</span> : null}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold">{formatINR(price)}</span>
          {mrp > price && <span className="text-sm text-muted-foreground line-through">{formatINR(mrp)}</span>}
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <Button size="sm" onClick={() => add({ productId: product.id, slug: product.slug, name: product.name, price, mrp, image: product.image_url })}>
            Add to Cart
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/shop/$slug" params={{ slug: product.slug }}>View Details</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export type CourseLite = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  image_url: string | null;
  age_group: string | null;
  duration: string | null;
  level: string;
  price?: number;
  course_categories?: { name: string; slug: string } | null;
};

export function CourseCard({ course }: { course: CourseLite }) {
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={course.image_url ?? ""} alt="" loading="lazy" width={1280} height={960} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">{course.course_categories?.name}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.short_description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-medium"><Users className="size-3" />{course.age_group}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-medium"><Clock className="size-3" />{course.duration}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-medium"><Signal className="size-3" />{course.level}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-5">
          {course.price ? <span className="font-bold">{formatINR(course.price)}</span> : <span />}
          <Button asChild size="sm" variant="outline">
            <Link to="/courses/$slug" params={{ slug: course.slug }}>View Course</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
