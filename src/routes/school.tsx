import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpenCheck, Building2, GraduationCap, LineChart, Microscope, Settings2, Users2 } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { Faq, IconBadge, PartnerGrid, TONES } from "@/components/site/Blocks";
import { SchoolPartnerForm } from "@/components/site/LeadForms";
import { Button } from "@/components/ui/button";
import { img } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/school")({
  head: () => ({ meta: pageMeta("Innovation Labs for Schools", "Set up a robotics, coding and AI innovation lab in your school with curriculum, kits, teacher training and ongoing support.") }),
  component: SchoolPage,
});

const OFFER = [
  { icon: Microscope, title: "Innovation Lab Setup", text: "Design, furniture, kits and safety — a ready-to-use STEM lab." },
  { icon: BookOpenCheck, title: "Grade-wise Curriculum", text: "NEP 2020 aligned lesson plans for grades 1–12." },
  { icon: GraduationCap, title: "Teacher Training", text: "Certification programs so your staff teach with confidence." },
  { icon: Award, title: "Competitions", text: "Inter-school robotics and coding contests and hackathons." },
  { icon: LineChart, title: "Progress Reports", text: "Student-wise dashboards for teachers and management." },
  { icon: Settings2, title: "Ongoing Support", text: "Dedicated coordinator, kit refills and maintenance." },
];

const STEPS = [
  { title: "Consultation", text: "We understand your goals, grades and space." },
  { title: "Lab design", text: "A tailored lab layout and kit plan." },
  { title: "Installation", text: "Setup, branding and safety checks." },
  { title: "Training", text: "Hands-on teacher certification." },
  { title: "Launch & support", text: "Classes start with our coordinator on call." },
];

const FAQS = [
  { q: "How much space does a lab need?", a: "A standard classroom (around 400–600 sq ft) is enough for a 30-student lab." },
  { q: "Which grades can use the lab?", a: "We provide curriculum from grade 1 to 12, with age-appropriate kits for each level." },
  { q: "Do you train our teachers?", a: "Yes. Every partnership includes teacher training and certification, plus refresher sessions." },
  { q: "How long does setup take?", a: "Typically 3–6 weeks from agreement to the first class." },
];

function SchoolPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "For Schools" }]}
        eyebrow="School partnerships"
        title={<>Bring an <span className="text-gradient-brand">innovation lab</span> to your school</>}
        text="Robotics, coding, AI and STEM labs with curriculum, kits, teacher training and support — everything your school needs in one partnership."
        image={img.schoolLab}
      >
        <Button asChild variant="brand" size="lg"><a href="#partner-form">Partner With Us</a></Button>
        <Button asChild variant="outline" size="lg"><a href="/contact-us">Talk to Us</a></Button>
      </PageHero>

      <Section tone="white">
        <SectionHeading eyebrow="What you get" title="A complete STEM program, not just kits" />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OFFER.map((o, i) => (
            <StaggerItem key={o.title}>
              <div className="h-full rounded-3xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <IconBadge tone={TONES[i % 4]}><o.icon /></IconBadge>
                <h3 className="mt-4 text-lg font-bold">{o.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{o.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section>
        <SectionHeading eyebrow="How it works" title="From first call to first class" />
        <ol className="grid gap-4 md:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <li className="h-full rounded-3xl border bg-card p-5">
                <span className="grid size-10 place-items-center rounded-full bg-gradient-brand font-display font-bold text-primary-foreground">{i + 1}</span>
                <h3 className="mt-3 font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="white">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <img src={img.programStem} alt="Students experimenting in a STEM lab" loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold sm:text-4xl">Benefits for your school</h2>
            <ul className="mt-6 space-y-4">
              {[
                [Building2, "Stand out with a future-ready campus parents love."],
                [Users2, "Every student builds, codes and presents — not just the toppers."],
                [Award, "Win at science fairs, olympiads and national robotics contests."],
                [GraduationCap, "Teachers gain certified, career-boosting skills."],
              ].map(([Icon, text], i) => {
                const I = Icon as typeof Building2;
                return (
                  <li key={i} className="flex gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><I className="size-5" /></span>
                    <span className="pt-1.5">{text as string}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Our partners" title="Trusted by schools across India" />
        <PartnerGrid />
      </Section>

      <Section tone="white" id="partner-form">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading align="left" eyebrow="Get started" title="Partner with LearningBIX" text="Share a few details and our school partnerships team will reach out within two working days." className="mb-6" />
          </div>
          <div className="rounded-[2rem] border bg-card p-6 shadow-soft sm:p-8"><SchoolPartnerForm /></div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="FAQ" title="Questions schools ask" />
        <Faq items={FAQS} />
      </Section>
    </>
  );
}
