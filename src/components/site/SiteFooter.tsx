import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { CONTACT } from "@/data/site";
import { PROGRAMS } from "@/data/programs";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-brand" aria-hidden />
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-foreground/70">
            LearningBIX helps children learn robotics, coding, artificial intelligence, electronics and STEM through hands-on, joyful learning — at home, in schools and at our centres.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { Icon: Facebook, label: "Facebook", href: "https://facebook.com" },
              { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
              { Icon: Youtube, label: "YouTube", href: "https://youtube.com" },
              { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
            ].map(({ Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full bg-navy-foreground/10 transition hover:bg-primary">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/60">Quick links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["About Us", "/about"],
              ["Learning Center", "/learning-center"],
              ["BixCode", "/bixcode"],
              ["Shop", "/shop"],
              ["Book a Free Trial", "/book-free-trial"],
              ["Verify Certificate", "/verify-certificate"],
              ["Contact Us", "/contact-us"],
            ].map(([label, to]) => (
              <li key={to}>
                <a href={to} className="text-navy-foreground/80 hover:text-navy-foreground">{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/60">Programs</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {PROGRAMS.map((p) => (
              <li key={p.slug}>
                <Link to="/programs/$slug" params={{ slug: p.slug }} className="text-navy-foreground/80 hover:text-navy-foreground">{p.name}</Link>
              </li>
            ))}
            <li><Link to="/school" className="text-navy-foreground/80 hover:text-navy-foreground">School Solutions</Link></li>
            <li><Link to="/franchisee" className="text-navy-foreground/80 hover:text-navy-foreground">Franchise</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/60">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-foreground/80">
            <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" />{CONTACT.address}</li>
            <li><a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="flex gap-2 hover:text-navy-foreground"><Phone className="size-4" />{CONTACT.phone}</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="flex gap-2 hover:text-navy-foreground"><Mail className="size-4" />{CONTACT.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-navy-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} LearningBIX. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-navy-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-navy-foreground">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
