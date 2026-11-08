import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, Clock, PlayCircle, Signal, Users } from "lucide-react";
import { PageHero, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/motion";
import { FinalCta } from "@/components/site/Blocks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/pricing";
import { courseQuery } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/courses/$slug")({
  loader: async ({ params, context }) => {
    const course = await context.queryClient.ensureQueryData(courseQuery(params.slug));
    if (!course) throw notFound();
    return { title: course.title, short: course.short_description ?? "" };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? pageMeta(`${loaderData.title} Course`, loaderData.short) : [{ title: "Course not found – LearningBIX" }, { name: "robots", content: "noindex" }],
  }),
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const { data: course } = useSuspenseQuery(courseQuery(slug));
  if (!course) return null;
  const modules = [...(course.course_modules ?? [])].sort((a, b) => a.position - b.position);
  const lessonCount = modules.reduce((n, m) => n + (m.lessons?.length ?? 0), 0);
  const cat = course.course_categories;
  return (
    <>
      <PageHero
        crumbs={[{ label: "Programs", to: "/programs" }, ...(cat ? [{ label: cat.name, to: `/programs/${cat.slug}` }] : []), { label: course.title }]}
        eyebrow={cat?.name}
        title={course.title}
        text={course.description ?? course.short_description}
        image={course.image_url ?? undefined}
      >
        <Button asChild variant="brand" size="lg"><a href="/book-free-trial">Book a Free Trial</a></Button>
        <Button asChild variant="outline" size="lg"><a href="/contact-us">Enquire to Enroll</a></Button>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Course curriculum</h2>
            <p className="mt-2 text-muted-foreground">{modules.length} modules · {lessonCount} lessons</p>
            <Accordion type="multiple" defaultValue={modules[0] ? [modules[0].id] : []} className="mt-6 space-y-3">
              {modules.map((m, i) => (
                <AccordionItem key={m.id} value={m.id} className="rounded-2xl border bg-card px-5">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-3 text-left">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-primary">{i + 1}</span>
                      <span className="font-semibold">{m.title}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-11">
                      {[...(m.lessons ?? [])].sort((a, b) => a.position - b.position).map((l) => (
                        <li key={l.id} className="flex items-center gap-2 text-sm">
                          <PlayCircle className="size-4 text-primary" /> {l.title}
                          {l.duration_minutes ? <span className="ml-auto text-xs text-muted-foreground">{l.duration_minutes} min</span> : null}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <Reveal>
            <aside className="sticky top-24 rounded-[2rem] border bg-card p-6 shadow-soft">
              <div className="text-sm text-muted-foreground">Course fee</div>
              <div className="font-display text-3xl font-extrabold">{formatINR(course.price)}</div>
              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex items-center gap-2"><Users className="size-4 text-primary" /> Age group: {course.age_group}</li>
                <li className="flex items-center gap-2"><Clock className="size-4 text-primary" /> Duration: {course.duration}</li>
                <li className="flex items-center gap-2"><Signal className="size-4 text-primary" /> Level: {course.level}</li>
                <li className="flex items-center gap-2"><BookOpen className="size-4 text-primary" /> {lessonCount} lessons + quizzes</li>
              </ul>
              <Button asChild variant="brand" className="mt-6 w-full"><a href="/book-free-trial">Book a Free Trial</a></Button>
              <Button asChild variant="outline" className="mt-2 w-full"><Link to="/contact-us">Talk to an advisor</Link></Button>
              <p className="mt-4 text-xs text-muted-foreground">Enrolled students follow lessons and quizzes from their student dashboard.</p>
            </aside>
          </Reveal>
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
