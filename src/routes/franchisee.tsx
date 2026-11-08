import { createFileRoute } from "@tanstack/react-router";
import { BadgeIndianRupee, BookOpen, Handshake, Megaphone, MonitorSmartphone, PackageCheck, Store, TrendingUp } from "lucide-react";
import { PageHero, Section, SectionHeading, DemoNote } from "@/components/site/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { Faq, IconBadge, TONES } from "@/components/site/Blocks";
import { FranchiseForm } from "@/components/site/LeadForms";
import { Button } from "@/components/ui/button";
import { img } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/franchisee")({
  head: () => ({ meta: pageMeta("Franchise Opportunity", "Open a LearningBIX robotics and STEM centre in your city with training, curriculum, kits, marketing and software support.") }),
  component: FranchisePage,
});

const SUPPORT = [
  { icon: BookOpen, title: "Proven curriculum", text: "Ready lesson plans for ages 3–16 across five programs." },
  { icon: PackageCheck, title: "Kits & supplies", text: "Wholesale kit pricing and reliable delivery." },
  { icon: Handshake, title: "Training", text: "Owner and mentor training before launch." },
  { icon: Megaphone, title: "Marketing", text: "Launch campaigns, creatives and lead generation." },
  { icon: MonitorSmartphone, title: "Centre software", text: "Dashboards for students, batches, fees and reports." },
  { icon: Store, title: "Centre design", text: "Interior guidelines and branding for your space." },
];

const PLANS = [
  { name: "Micro Centre", space: "300–500 sq ft", investment: "₹5–10 Lakh", students: "Up to 80 students" },
  { name: "Standard Centre", space: "600–900 sq ft", investment: "₹10–20 Lakh", students: "Up to 200 students", featured: true },
  { name: "Flagship Centre", space: "1,000+ sq ft", investment: "₹20–35 Lakh", students: "300+ students" },
];

const FAQS = [
  { q: "Do I need a technical background?", a: "No. We train you and your mentors; a passion for education and local networking matter more." },
  { q: "How soon can I launch?", a: "Most centres open within 45–60 days of signing." },
  { q: "Is there a royalty?", a: "Yes, a small monthly royalty covers curriculum updates, software and marketing support. Details are shared after the first call." },
  { q: "Will you help find students?", a: "Yes. We run launch campaigns and share leads from your area." },
];

function FranchisePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Franchise" }]}
        eyebrow="Franchise opportunity"
        title={<>Open a <span className="text-gradient-brand">LearningBIX centre</span> in your city</>}
        text="Join a fast-growing STEM education network. Get a proven model, full training and a brand parents trust."
        image={img.franchiseCenter}
      >
        <Button asChild variant="brand" size="lg"><a href="#apply">Apply Now</a></Button>
        <Button asChild variant="outline" size="lg"><a href="/contact-us">Ask a Question</a></Button>
      </PageHero>

      <Section tone="white">
        <SectionHeading eyebrow="Why partner" title="Everything you need to run a great centre" />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORT.map((s, i) => (
            <StaggerItem key={s.title}>
              <div className="h-full rounded-3xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <IconBadge tone={TONES[i % 4]}><s.icon /></IconBadge>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section>
        <SectionHeading eyebrow="Formats" title="Choose the centre size that suits you" />
        <div className="mb-8 text-center"><DemoNote>Indicative figures — confirm before publishing</DemoNote></div>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div className={`relative h-full rounded-[2rem] border p-8 ${p.featured ? "bg-navy text-navy-foreground shadow-lift" : "bg-card shadow-soft"}`}>
                {p.featured && <span className="absolute right-6 top-6 rounded-full bg-sun px-3 py-1 text-xs font-bold text-sun-foreground">Most popular</span>}
                <Store className={`size-8 ${p.featured ? "text-sun" : "text-primary"}`} />
                <h3 className="mt-4 text-xl font-bold">{p.name}</h3>
                <div className="mt-4 flex items-center gap-2 font-display text-2xl font-extrabold"><BadgeIndianRupee className="size-6" />{p.investment}</div>
                <ul className={`mt-5 space-y-2 text-sm ${p.featured ? "opacity-90" : "text-muted-foreground"}`}>
                  <li>Space: {p.space}</li>
                  <li>Capacity: {p.students}</li>
                  <li className="flex items-center gap-1"><TrendingUp className="size-4" /> Full launch support</li>
                </ul>
                <Button asChild variant={p.featured ? "sun" : "outline"} className="mt-6 w-full"><a href="#apply">Enquire</a></Button>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="white" id="apply">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading align="left" eyebrow="Apply" title="Start your franchise application" text="Tell us about yourself. Our franchise team will call you to discuss the next steps." className="mb-0" />
          <div className="rounded-[2rem] border bg-card p-6 shadow-soft sm:p-8"><FranchiseForm /></div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="FAQ" title="Franchise questions" />
        <Faq items={FAQS} />
      </Section>
    </>
  );
}
