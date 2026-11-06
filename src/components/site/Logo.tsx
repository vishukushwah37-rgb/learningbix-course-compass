import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)} aria-label="LearningBIX home">
      <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-brand shadow-glow">
        <svg viewBox="0 0 24 24" className="size-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <rect x="5" y="7" width="14" height="11" rx="3" />
          <path d="M12 3v4M9 12h.01M15 12h.01M9.5 15.5h5" />
        </svg>
        <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-surface bg-sun" />
      </span>
      <span className={cn("font-display text-xl font-extrabold tracking-tight", light ? "text-navy-foreground" : "text-foreground")}>
        Learning<span className="text-gradient-brand">BIX</span>
      </span>
    </Link>
  );
}
