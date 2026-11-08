import { createFileRoute } from "@tanstack/react-router";
import { Compass, Eye, Heart, Lightbulb, ShieldCheck, Users } from "lucide-react";
import { PageHero, Section, SectionHeading, DemoNote } from "@/components/site/Section";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { FinalCta, IconBadge, TONES } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { STATS, TEAM, TIMELINE, WHY_CHOOSE } from "@/data/site";
import { img } from "@/lib/images";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: pageMeta("About Us", "Our story, mission and the team helping children across India become inventors through robotics, coding and STEM.") }),
  component: About,
});

const VALUES = [
  { icon: Lightbulb, title: "Curiosity first", text: "Every lesson starts with a question worth exploring." },
  { icon: Heart, title: "Joy in learning", text: "Kids learn best when they're having fun building." },
  { icon: Users, title: "Learning together", text: "Teamwork, sharing and respect in every batch." },
  { icon: ShieldCheck, title: "Safe & inclusive", text: "Child-safe kits, verified mentors, welcoming classrooms." },
];

function About() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About Us" }]}
        eyebrow="Our story"
        title={<>We help kids <span className="text-gradient-brand">invent the future</span></>}
        text="LearningBIX began as a weekend robotics club and grew into a learning platform for families, schools and franchise centres across India."
        image={img.heroKidsRobotics}
      >
        <Button asChild variant="brand" size="lg"><a href="/book-free-trial">Book a Free Trial</a></Button>
        <Button asChild variant="outline" size="lg"><a href="/programs">Explore Programs</a></Button>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Compass, title: "Our Mission", text: "To give every child hands-on access to robotics, coding, AI and STEM — so they grow into confident problem-solvers who build, not just consume, technology." },
            { icon: Eye, title: "Our Vision", text: "A generation of young Indian innovators who use technology creatively and responsibly to make life better for their communities." },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 0.1}>
              <div className="h-full rounded-3xl border bg-card p-8 shadow-soft">
                <IconBadge tone={i ? "violet" : "primary"}><b.icon /></IconBadge>
                <h2 className="mt-5 text-2xl font-bold">{b.title}</h2>
                <p className="mt-3 text-muted-foreground">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="What we stand for" title="Our values" />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <StaggerItem key={v.title}>
              <div className="h-full rounded-3xl border bg-card p-6 text-center transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex justify-center"><IconBadge tone={TONES[i % 4]}><v.icon /></IconBadge></div>
                <h3 className="mt-4 font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="navy">
        <div className="mb-8 text-center"><DemoNote>Sample figures</DemoNote></div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl font-extrabold text-sun sm:text-5xl"><Counter to={s.value} suffix={s.suffix} /></div>
              <div className="mt-2 text-sm opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Our journey" title="From a garage club to a national network" />
        <div className="mx-auto mb-8 text-center"><DemoNote>Sample timeline</DemoNote></div>
        <ol className="relative mx-auto max-w-3xl border-l-2 border-dashed border-primary/30 pl-8">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.05}>
              <li className="relative mb-10 last:mb-0">
                <span className={cn("absolute -left-[2.6rem] top-1 grid size-6 place-items-center rounded-full ring-4 ring-surface", ["bg-primary", "bg-violet", "bg-sun", "bg-mint"][i % 4])} />
                <span className="font-display text-sm font-bold text-primary">{t.year}</span>
                <h3 className="mt-1 text-lg font-bold">{t.title}</h3>
                <p className="mt-1 text-muted-foreground">{t.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading eyebrow="The people" title="Meet our team" />
        <div className="mb-8 text-center"><DemoNote>Sample team — replace with your real team</DemoNote></div>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <StaggerItem key={m.name}>
              <div className="h-full rounded-3xl border bg-card p-6 text-center shadow-soft">
                <span className={cn("mx-auto grid size-20 place-items-center rounded-full font-display text-2xl font-bold text-primary-foreground", ["bg-primary", "bg-violet", "bg-sun", "bg-mint"][i % 4])}>
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <h3 className="mt-4 font-bold">{m.name}</h3>
                <div className="text-sm font-medium text-primary">{m.role}</div>
                <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Why LearningBIX" title="Why families and schools choose us" />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((w, i) => (
            <StaggerItem key={w.title}>
              <div className="h-full rounded-3xl border bg-card p-6">
                <span className={cn("font-display text-3xl font-extrabold", ["text-primary", "text-violet", "text-sun", "text-mint"][i % 4])}>0{i + 1}</span>
                <h3 className="mt-2 font-bold">{w.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <FinalCta />
    </>
  );
}
