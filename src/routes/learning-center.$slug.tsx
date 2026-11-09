import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Clock, Gauge, Package, Target } from "lucide-react";
import { useState } from "react";
import { PageHero, Section, DemoNote } from "@/components/site/Section";
import { Reveal } from "@/components/site/motion";
import { FinalCta } from "@/components/site/Blocks";
import { LEARNING_PROJECTS, projectBySlug } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learning-center/$slug")({
  loader: ({ params }) => {
    const p = projectBySlug(params.slug);
    if (!p) throw notFound();
    return { title: p.title, intro: p.intro };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? pageMeta(`${loaderData.title} – DIY Project`, loaderData.intro) : [{ title: "Project not found – LearningBIX" }, { name: "robots", content: "noindex" }],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const p = projectBySlug(slug)!;
  const [active, setActive] = useState(0);
  const more = LEARNING_PROJECTS.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 3);
  return (
    <>
      <PageHero crumbs={[{ label: "Learning Center", to: "/learning-center" }, { label: p.title }]} eyebrow={p.category} title={p.title} text={p.intro}>
        <span className="inline-flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-sm font-medium shadow-soft"><Gauge className="size-4 text-primary" />{p.difficulty}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-sm font-medium shadow-soft"><Clock className="size-4 text-primary" />{p.time}</span>
      </PageHero>
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <img src={p.gallery[active] ?? p.image} alt={p.title} className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" />
            {p.gallery.length > 1 && (
              <div className="mt-3 flex gap-3">
                {p.gallery.map((g, i) => (
                  <button key={g + i} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} className={cn("size-20 overflow-hidden rounded-xl border-2", i === active ? "border-primary" : "border-transparent opacity-70")}>
                    <img src={g} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <h2 className="mt-10 text-2xl font-bold">Step-by-step instructions</h2>
            <ol className="mt-5 space-y-4">
              {p.steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.05}>
                  <li className="flex gap-4 rounded-2xl border bg-card p-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-brand font-display font-bold text-primary-foreground">{i + 1}</span>
                    <div><h3 className="font-bold">{s.title}</h3><p className="mt-1 text-muted-foreground">{s.text}</p></div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <div className="mt-10">
              <div className="mb-3 flex items-center gap-3"><h2 className="text-2xl font-bold">Video tutorial</h2><DemoNote>Sample video</DemoNote></div>
              <video src={p.video} controls preload="metadata" className="aspect-video w-full rounded-2xl bg-navy" />
            </div>
          </div>
          <aside className="space-y-5">
            {[
              { icon: Target, title: "Objectives", items: p.objectives },
              { icon: Package, title: "Materials required", items: p.materials },
              { icon: CheckCircle2, title: "Learning outcomes", items: p.outcomes },
            ].map((b) => (
              <div key={b.title} className="rounded-3xl border bg-card p-6 shadow-soft">
                <h3 className="flex items-center gap-2 font-bold"><b.icon className="size-5 text-primary" />{b.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{b.items.map((x) => <li key={x}>• {x}</li>)}</ul>
              </div>
            ))}
            {more.length > 0 && (
              <div className="rounded-3xl border bg-card p-6">
                <h3 className="font-bold">More {p.category} projects</h3>
                <ul className="mt-3 space-y-3">
                  {more.map((m) => (
                    <li key={m.slug}>
                      <Link to="/learning-center/$slug" params={{ slug: m.slug }} className="flex items-center gap-3 hover:text-primary">
                        <img src={m.image} alt="" className="size-12 rounded-lg object-cover" />
                        <span className="text-sm font-semibold">{m.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Section>
      <FinalCta title="Want a mentor to build with?" text="Join a live class and build projects like this every week." />
    </>
  );
}
