import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PARTNERS, TESTIMONIALS } from "@/data/site";
import { cn } from "@/lib/utils";
import { Stars } from "./Cards";
import { Floating, Reveal } from "./motion";
import { DemoNote } from "./Section";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion type="single" collapsible className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => (
        <AccordionItem key={f.q} value={`f${i}`} className="rounded-2xl border bg-card px-5 shadow-soft">
          <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FinalCta({
  title = "Start Your Child's Innovation Journey Today",
  text = "Book a free trial class and see the spark for yourself.",
  primary = { label: "Book a Free Trial", to: "/book-free-trial" },
  secondary = { label: "Explore Courses", to: "/programs" },
}: {
  title?: string;
  text?: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-brand px-6 py-14 text-center text-primary-foreground shadow-lift sm:px-12 sm:py-20">
            <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
            <Floating className="absolute -left-6 top-6 hidden size-24 rounded-3xl bg-sun/80 sm:block" />
            <Floating className="absolute -bottom-8 right-10 hidden size-32 rounded-full bg-mint/70 sm:block" delay={1.2} />
            <div className="relative">
              <Rocket className="mx-auto size-10" />
              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold sm:text-5xl">{title}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">{text}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" variant="sun"><a href={primary.to}>{primary.label}</a></Button>
                <Button asChild size="lg" variant="light"><a href={secondary.to}>{secondary.label}</a></Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Testimonials({ filter }: { filter?: string }) {
  const items = filter ? TESTIMONIALS.filter((t) => t.type === filter) : TESTIMONIALS;
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);
  const t = items[i]!;
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 text-center"><DemoNote>Sample testimonials</DemoNote></div>
      <div className="relative overflow-hidden rounded-[2rem] border bg-card p-8 shadow-soft sm:p-12">
        <Quote className="absolute right-8 top-8 size-16 text-secondary" />
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
            <Stars value={t.rating} className="[&_svg]:size-5" />
            <p className="mt-5 text-lg leading-relaxed sm:text-xl">“{t.text}”</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-gradient-brand font-display font-bold text-primary-foreground">
                {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
              <span className="ml-auto rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">{t.type}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-5 flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" aria-label="Previous testimonial" onClick={() => setI((v) => (v - 1 + items.length) % items.length)}><ChevronLeft /></Button>
        {items.map((_, idx) => (
          <button key={idx} aria-label={`Show testimonial ${idx + 1}`} onClick={() => setI(idx)} className={cn("h-2 rounded-full transition-all", idx === i ? "w-8 bg-primary" : "w-2 bg-border")} />
        ))}
        <Button variant="outline" size="icon" aria-label="Next testimonial" onClick={() => setI((v) => (v + 1) % items.length)}><ChevronRight /></Button>
      </div>
    </div>
  );
}

export function PartnerGrid() {
  return (
    <div>
      <div className="mb-6 text-center"><DemoNote>Placeholder partner logos</DemoNote></div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {PARTNERS.map((p, idx) => (
          <div key={p} className="flex h-24 items-center justify-center gap-3 rounded-2xl border bg-card px-4 grayscale transition hover:grayscale-0 hover:shadow-soft">
            <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-primary-foreground", ["bg-primary", "bg-violet", "bg-sun", "bg-mint"][idx % 4])}>
              {p.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </span>
            <span className="text-sm font-semibold leading-tight">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IconBadge({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "violet" | "sun" | "mint" | undefined }) {
  const map = { primary: "bg-primary/10 text-primary", violet: "bg-violet/10 text-violet", sun: "bg-sun/15 text-sun-foreground", mint: "bg-mint/15 text-mint" };
  return <span className={cn("grid size-12 place-items-center rounded-2xl [&_svg]:size-6", map[tone])}>{children}</span>;
}

export const TONES = ["primary", "violet", "sun", "mint"] as const;
