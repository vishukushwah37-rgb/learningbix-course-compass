import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero, Section, DemoNote } from "@/components/site/Section";
import { ContactForm } from "@/components/site/LeadForms";
import { CONTACT } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact-us")({
  head: () => ({ meta: pageMeta("Contact Us", "Questions about courses, kits, school labs or franchising? Send us a message and the LearningBIX team will get back to you.") }),
  component: Contact,
});

function Contact() {
  const items = [
    { icon: Phone, label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: MapPin, label: "Address", value: CONTACT.address },
    { icon: Clock, label: "Hours", value: CONTACT.hours },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: "Contact Us" }]} eyebrow="Get in touch" title="We'd love to hear from you" text="Ask about courses, kits, school labs or franchising — we usually reply within one working day." />
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <DemoNote>Sample contact details</DemoNote>
            {items.map((i) => (
              <div key={i.label} className="flex gap-4 rounded-3xl border bg-card p-5 shadow-soft">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><i.icon className="size-5" /></span>
                <div>
                  <div className="text-sm text-muted-foreground">{i.label}</div>
                  {i.href ? <a href={i.href} className="font-semibold hover:text-primary">{i.value}</a> : <div className="font-semibold">{i.value}</div>}
                </div>
              </div>
            ))}
            <iframe
              title="Map"
              className="h-64 w-full rounded-3xl border"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT.address)}&output=embed`}
            />
          </div>
          <div className="rounded-[2rem] border bg-card p-6 shadow-soft sm:p-8">
            <h2 className="mb-6 text-2xl font-bold">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
