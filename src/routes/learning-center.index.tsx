import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Gauge, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHero, Section } from "@/components/site/Section";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { Input } from "@/components/ui/input";
import { LEARNING_CENTER_CATEGORIES, LEARNING_PROJECTS } from "@/data/site";
import { img } from "@/lib/images";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learning-center/")({
  head: () => ({ meta: pageMeta("Learning Center – DIY Projects", "Free step-by-step robotics, electronics, coding and science projects kids can build at home.") }),
  component: LearningCenter,
});

const DIFF_TONE = { Easy: "bg-mint/15 text-mint", Medium: "bg-sun/15 text-sun-foreground", Hard: "bg-destructive/10 text-destructive" } as const;

function LearningCenter() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const list = useMemo(
    () => LEARNING_PROJECTS.filter((p) => (cat === "All" || p.category === cat) && p.title.toLowerCase().includes(q.trim().toLowerCase())),
    [cat, q],
  );
  return (
    <>
      <PageHero
        crumbs={[{ label: "Learning Center" }]}
        eyebrow="Free projects"
        title={<>Build, test, <span className="text-gradient-brand">learn at home</span></>}
        text="Step-by-step DIY projects with materials lists, instructions and videos. Pick one and start building today."
        image={img.projectCatapult}
      />
      <Section tone="white">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
            {["All", ...LEARNING_CENTER_CATEGORIES].map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={cn("rounded-full border px-4 py-2 text-sm font-semibold transition", cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary hover:text-primary")}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" className="pl-9" aria-label="Search projects" />
          </div>
        </div>
        {list.length ? (
          <Stagger key={cat + q} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <StaggerItem key={p.slug}>
                <motion.article whileHover={{ y: -6 }} className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-soft">
                  <Link to="/learning-center/$slug" params={{ slug: p.slug }} className="aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt={p.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">{p.category}</span>
                    <h2 className="mt-1 text-lg font-bold"><Link to="/learning-center/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.title}</Link></h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.intro}</p>
                    <div className="mt-auto flex gap-2 pt-4 text-xs font-medium">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1", DIFF_TONE[p.difficulty])}><Gauge className="size-3" />{p.difficulty}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1"><Clock className="size-3" />{p.time}</span>
                    </div>
                  </div>
                </motion.article>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="py-16 text-center text-muted-foreground">No projects match your search.</p>
        )}
      </Section>
    </>
  );
}
