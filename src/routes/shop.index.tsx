import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHero, Section } from "@/components/site/Section";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { ProductCard } from "@/components/site/Cards";
import { selectClass } from "@/components/site/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { img } from "@/lib/images";
import { formatINR } from "@/lib/pricing";
import { productsQuery } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

type ShopSearch = { category?: string };

export const Route = createFileRoute("/shop/")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => (typeof s.category === "string" ? { category: s.category.slice(0, 60) } : {}),
  head: () => ({ meta: pageMeta("Shop Robotics & STEM Kits", "Robotics, electronics, STEM, DIY and coding kits for kids — delivered across India.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Shop,
});

const PRICE_BANDS = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "u1500", label: `Under ${formatINR(1500)}`, min: 0, max: 1499 },
  { id: "1500-2500", label: `${formatINR(1500)} – ${formatINR(2500)}`, min: 1500, max: 2500 },
  { id: "o2500", label: `Over ${formatINR(2500)}`, min: 2501, max: Infinity },
];
const SORTS = { featured: "Featured", "price-asc": "Price: low to high", "price-desc": "Price: high to low", rating: "Top rated", new: "Newest" } as const;

function ageMin(a: string | null | undefined) {
  const m = a?.match(/\d+/);
  return m ? Number(m[0]) : 0;
}

function Shop() {
  const { data } = useSuspenseQuery(productsQuery());
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const category = search.category ?? "all";
  const [q, setQ] = useState("");
  const [band, setBand] = useState("all");
  const [age, setAge] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<keyof typeof SORTS>("featured");

  const ages = useMemo(() => Array.from(new Set(data.products.map((p) => p.age_group).filter(Boolean) as string[])).sort((a, b) => ageMin(a) - ageMin(b)), [data.products]);

  const list = useMemo(() => {
    const b = PRICE_BANDS.find((x) => x.id === band)!;
    const term = q.trim().toLowerCase();
    const out = data.products.filter((p) => {
      const price = Number(p.price);
      return (
        (category === "all" || p.product_categories?.slug === category) &&
        price >= b.min && price <= b.max &&
        (age === "all" || p.age_group === age) &&
        Number(p.rating) >= minRating &&
        (!term || p.name.toLowerCase().includes(term) || (p.short_description ?? "").toLowerCase().includes(term))
      );
    });
    const sorted = [...out];
    if (sort === "price-asc") sorted.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") sorted.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "rating") sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
    if (sort === "new") sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (sort === "featured") sorted.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    return sorted;
  }, [data.products, category, band, age, minRating, q, sort]);

  const setCategory = (slug: string) => void navigate({ search: slug === "all" ? {} : { category: slug }, replace: true, resetScroll: false });
  const activeFilters = Number(category !== "all") + Number(band !== "all") + Number(age !== "all") + Number(minRating > 0);
  const reset = () => {
    setCategory("all");
    setBand("all");
    setAge("all");
    setMinRating(0);
    setQ("");
  };

  const filters = (
    <div className="space-y-7">
      <FilterGroup title="Category">
        {[{ name: "All kits", slug: "all" }, ...data.categories].map((c) => (
          <Chip key={c.slug} active={category === c.slug} onClick={() => setCategory(c.slug)}>{c.name}</Chip>
        ))}
      </FilterGroup>
      <FilterGroup title="Price">
        {PRICE_BANDS.map((b) => <Chip key={b.id} active={band === b.id} onClick={() => setBand(b.id)}>{b.label}</Chip>)}
      </FilterGroup>
      <FilterGroup title="Age group">
        <Chip active={age === "all"} onClick={() => setAge("all")}>All ages</Chip>
        {ages.map((a) => <Chip key={a} active={age === a} onClick={() => setAge(a)}>{a}</Chip>)}
      </FilterGroup>
      <FilterGroup title="Rating">
        {[0, 4, 4.5].map((r) => <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>{r ? `${r}★ & up` : "Any rating"}</Chip>)}
      </FilterGroup>
      {activeFilters > 0 && <Button variant="ghost" size="sm" onClick={reset}><X /> Clear filters</Button>}
    </div>
  );

  return (
    <>
      <PageHero crumbs={[{ label: "Shop" }]} eyebrow="LearningBIX store" title={<>Kits that make <span className="text-gradient-brand">learning click</span></>} text="Robotics, electronics, STEM and DIY kits with illustrated manuals and video guides." image={img.productSpaceRover} />
      <Section tone="white" className="pt-10 sm:pt-12 lg:pt-14">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">{filters}</aside>
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search kits" className="pl-9" aria-label="Search kits" />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden"><SlidersHorizontal /> Filters{activeFilters ? ` (${activeFilters})` : ""}</Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  <div className="px-4 pb-6">{filters}</div>
                </SheetContent>
              </Sheet>
              <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className={cn(selectClass, "w-auto")} aria-label="Sort by">
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{list.length} {list.length === 1 ? "kit" : "kits"}</p>
            {list.length ? (
              <Stagger key={`${category}${band}${age}${minRating}${sort}`} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((p) => <StaggerItem key={p.id}><ProductCard product={p} /></StaggerItem>)}
              </Stagger>
            ) : (
              <div className="rounded-3xl border border-dashed p-12 text-center">
                <p className="font-semibold">No kits match these filters.</p>
                <Button variant="outline" className="mt-4" onClick={reset}>Clear filters</Button>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition", active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary hover:text-primary")}>
      {children}
    </button>
  );
}
