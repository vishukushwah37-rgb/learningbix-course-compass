import type { ReactNode } from "react";
import { Rocket } from "lucide-react";
import { img } from "@/lib/images";
import { Reveal } from "./motion";

export function AuthShell({ title, text, children }: { title: string; text?: ReactNode; children: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-hero-glow">
      <div className="container-page grid min-h-[80vh] items-center gap-10 py-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="mx-auto w-full max-w-md rounded-[2rem] border bg-card p-6 shadow-lift sm:p-8">
            <h1 className="text-3xl font-extrabold">{title}</h1>
            {text && <p className="mt-2 text-muted-foreground">{text}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="order-1 hidden lg:order-2 lg:block">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-brand opacity-25 blur-3xl" aria-hidden />
            <img src={img.heroKidsRobotics} alt="" className="relative aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-lift" />
            <div className="glass absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-soft">
              <Rocket className="size-6 text-primary" />
              <div><div className="text-sm font-bold">Learn. Build. Innovate.</div><div className="text-xs text-muted-foreground">Courses, quizzes and certificates in one place</div></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function GoogleButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-full border bg-surface text-sm font-semibold shadow-sm transition hover:border-primary disabled:opacity-60"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z" />
        <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.6-2.8z" />
        <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.1 7.1l3.6 2.8C6.6 7.4 9.1 5.4 12 5.4z" />
      </svg>
      Continue with Google
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
      <span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" />
    </div>
  );
}
