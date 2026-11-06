import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

export function Section({ children, className, id, tone = "default" }: { children: ReactNode; className?: string; id?: string; tone?: "default" | "white" | "navy" | "tint" }) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        tone === "white" && "bg-surface",
        tone === "navy" && "bg-navy text-navy-foreground",
        tone === "tint" && "bg-secondary/60",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary", className)}>
      <span className="size-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, text, align = "center", className }: { eyebrow?: string; title: ReactNode; text?: ReactNode; align?: "center" | "left"; className?: string }) {
  return (
    <Reveal className={cn("mb-12 max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {text && <p className="mt-4 text-lg text-muted-foreground">{text}</p>}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  children,
  crumbs,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  image?: string;
  children?: ReactNode;
  crumbs?: { label: string; to?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-hero-glow">
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
      <div className="container-page relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:py-24">
        <Reveal>
          {crumbs && (
            <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              {crumbs.map((c) => (
                <span key={c.label} className="flex items-center gap-1">
                  <ChevronRight className="size-3.5" />
                  {c.to ? <a href={c.to} className="hover:text-primary">{c.label}</a> : <span className="text-foreground">{c.label}</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
          <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">{title}</h1>
          {text && <p className="mt-5 max-w-xl text-lg text-muted-foreground">{text}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </Reveal>
        {image && (
          <Reveal delay={0.15} className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-brand opacity-20 blur-2xl" aria-hidden />
            <img src={image} alt="" width={1280} height={960} className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function DemoNote({ children = "Demo content — replace with your real data", className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-dashed border-sun bg-sun/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sun-foreground", className)}>
      {children}
    </span>
  );
}
