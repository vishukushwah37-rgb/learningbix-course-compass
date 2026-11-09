import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Gift, Package, Users } from "lucide-react";
import { PageHero, Section } from "@/components/site/Section";
import { TrialForm } from "@/components/site/LeadForms";
import { PROGRAM_OPTIONS } from "@/lib/schemas";
import { pageMeta } from "@/lib/seo";
import { img } from "@/lib/images";

type Search = { program?: (typeof PROGRAM_OPTIONS)[number] };

export const Route = createFileRoute("/book-free-trial")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const p = s.program;
    return PROGRAM_OPTIONS.includes(p as never) ? { program: p as Search["program"] } : {};
  },
  head: () => ({ meta: pageMeta("Book a Free Trial Class", "Book a free live robotics, coding, AI or STEM trial class for your child aged 3 to 16.") }),
  component: Trial,
});

function Trial() {
  const { program } = Route.useSearch();
  return (
    <>
      <PageHero crumbs={[{ label: "Book a Free Trial" }]} eyebrow="Free trial" title={<>Book a <span className="text-gradient-brand">free trial class</span></>} text="60 minutes, a live mentor and a real build. No payment needed." image={img.programRobotics} />
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What happens in a trial?</h2>
            {[
              [Users, "Meet your mentor", "A friendly expert introduces the program and gets to know your child."],
              [Package, "Hands-on build", "Your child builds and codes a mini project during the class."],
              [CalendarCheck, "Learning plan", "You get a recommended course and level based on the session."],
              [Gift, "No obligation", "The trial is completely free — enroll only if your child loves it."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof Users;
              return (
                <div key={t as string} className="flex gap-4 rounded-3xl border bg-card p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><I className="size-5" /></span>
                  <div><h3 className="font-bold">{t as string}</h3><p className="text-sm text-muted-foreground">{d as string}</p></div>
                </div>
              );
            })}
          </div>
          <div className="rounded-[2rem] border bg-card p-6 shadow-soft sm:p-8">
            <h2 className="mb-6 text-2xl font-bold">Your details</h2>
            <TrialForm defaultProgram={program} />
          </div>
        </div>
      </Section>
    </>
  );
}
