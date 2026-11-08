import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { FinalCta } from "@/components/site/Blocks";
import { CourseCard } from "@/components/site/Cards";
import { PROGRAMS } from "@/data/programs";
import { img } from "@/lib/images";
import { coursesQuery } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/programs/")({
  head: () => ({ meta: pageMeta("Programs & Courses", "Robotics, coding, pre-school, STEM and AI programs for children aged 3 to 16, with live mentors and real kits.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery()),
  component: Programs,
});

function Programs() {
  const { data: courses } = useSuspenseQuery(coursesQuery());
  return (
    <>
      <PageHero
        crumbs={[{ label: "Programs" }]}
        eyebrow="Our programs"
        title={<>Five tracks. <span className="text-gradient-brand">Endless curiosity.</span></>}
        text="Pick a program to see age groups, curriculum, projects and the courses inside it."
        image={img.programRobotics}
      />
      <Section tone="white">
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <StaggerItem key={p.slug}>
              <motion.article whileHover={{ y: -6 }} className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-soft">
                <div className="aspect-[16/10] overflow-hidden"><img src={p.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-bold">{p.name}</h2>
                  <p className="mt-1 text-sm font-medium text-primary">{p.tagline}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{p.short}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.ageGroups.map((a) => <span key={a.label} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{a.range}</span>)}
                  </div>
                  <Link to="/programs/$slug" params={{ slug: p.slug }} className="mt-auto inline-flex items-center gap-1 pt-5 font-semibold text-primary">
                    Explore {p.name} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
      <Section>
        <SectionHeading eyebrow="All courses" title={`${courses.length} courses to choose from`} />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => <StaggerItem key={c.id}><CourseCard course={c} /></StaggerItem>)}
        </Stagger>
      </Section>
      <FinalCta />
    </>
  );
}
