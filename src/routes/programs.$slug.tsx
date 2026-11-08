import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2, Hammer, Rocket, Sparkles } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { Faq, FinalCta, IconBadge, TONES } from "@/components/site/Blocks";
import { CourseCard } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { programBySlug } from "@/data/programs";
import { coursesQuery } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/programs/$slug")({
  loader: async ({ params, context }) => {
    const program = programBySlug(params.slug);
    if (!program) throw notFound();
    await context.queryClient.ensureQueryData(coursesQuery(program.slug));
    return { name: program.name, short: program.short };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMeta(`${loaderData.name} Program for Kids`, loaderData.short)
      : [{ title: "Program not found – LearningBIX" }, { name: "robots", content: "noindex" }],
  }),
  component: ProgramPage,
});

function ProgramPage() {
  const { slug } = Route.useParams();
  const p = programBySlug(slug)!;
  const { data: courses } = useSuspenseQuery(coursesQuery(p.slug));
  return (
    <>
      <PageHero crumbs={[{ label: "Programs", to: "/programs" }, { label: p.name }]} eyebrow={p.tagline} title={p.name} text={p.intro} image={p.image}>
        <Button asChild variant="brand" size="lg"><a href="/book-free-trial">Book a Free Trial</a></Button>
        <Button asChild variant="outline" size="lg"><a href="#courses">View Courses</a></Button>
      </PageHero>

      <Section tone="white">
        <SectionHeading eyebrow="Age groups" title="A path for every age" />
        <div className="grid gap-5 md:grid-cols-3">
          {p.ageGroups.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.08}>
              <div className="h-full rounded-3xl border bg-card p-6 shadow-soft">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">{a.range}</span>
                <h3 className="mt-4 text-xl font-bold">{a.label}</h3>
                <p className="mt-2 text-muted-foreground">{a.focus}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Learning outcomes" title="What your child will learn" className="mb-6" />
            <ul className="grid gap-3 sm:grid-cols-2">
              {p.outcomes.map((o) => (
                <li key={o} className="flex gap-2 rounded-2xl border bg-card p-4"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mint" />{o}</li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Curriculum" title="Course structure" className="mb-6" />
            <ol className="space-y-3">
              {p.curriculum.map((c, i) => (
                <li key={c.level} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">{i + 1}</span>
                    <h3 className="font-bold">{c.level}</h3>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 pl-11">
                    {c.topics.map((t) => <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{t}</span>)}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border bg-card p-6">
              <IconBadge tone="violet"><Sparkles /></IconBadge>
              <h3 className="mt-4 text-xl font-bold">Activities</h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">{p.activities.map((a) => <li key={a}>• {a}</li>)}</ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border bg-card p-6">
              <IconBadge tone="sun"><Hammer /></IconBadge>
              <h3 className="mt-4 text-xl font-bold">Projects kids build</h3>
              <div className="mt-3 flex flex-wrap gap-2">{p.projects.map((a) => <span key={a} className="rounded-full bg-sun/15 px-3 py-1 text-sm font-medium">{a}</span>)}</div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Benefits" title={`Why ${p.name}?`} />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {p.benefits.map((b, i) => (
            <StaggerItem key={b.title}>
              <div className="h-full rounded-3xl border bg-card p-6">
                <IconBadge tone={TONES[i % 4]}><Rocket /></IconBadge>
                <h3 className="mt-4 font-bold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="white" id="courses">
        <SectionHeading eyebrow="Courses" title={`${p.name} courses`} />
        {courses.length ? (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => <StaggerItem key={c.id}><CourseCard course={c} /></StaggerItem>)}
          </Stagger>
        ) : (
          <p className="text-center text-muted-foreground">New courses coming soon.</p>
        )}
      </Section>

      <Section>
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <Faq items={p.faqs} />
      </Section>

      <FinalCta title={`Start ${p.name} with a free class`} />
    </>
  );
}
