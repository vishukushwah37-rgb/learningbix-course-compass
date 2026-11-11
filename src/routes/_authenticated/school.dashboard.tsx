import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, Building2, GraduationCap, Users, Wallet } from "lucide-react";
import { DashboardShell, Empty, Panel, StatCard } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { schoolHomeQuery } from "@/lib/org.queries";
import { formatINR } from "@/lib/pricing";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/school/dashboard")({
  head: () => ({ meta: [...pageMeta("School Dashboard", "Your school's LearningBIX classes, batches and learners."), { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(schoolHomeQuery(context.userId)),
  component: SchoolHome,
});

function SchoolHome() {
  const { userId } = Route.useRouteContext();
  const { data } = useSuspenseQuery(schoolHomeQuery(userId));

  if (!data.school) {
    return (
      <DashboardShell role="school_admin" title="School dashboard">
        <Empty>
          No school is linked to this account yet. A LearningBIX admin creates the school record and points it at your email — once that's done, your classes, batches and students appear here.
          <div className="mt-4"><Button asChild variant="brand"><Link to="/school">Talk to us about partnering</Link></Button></div>
        </Empty>
      </DashboardShell>
    );
  }

  const s = data.school;
  const paid = data.payments.filter((p) => p.status === "paid").reduce((n, p) => n + Number(p.amount), 0);

  return (
    <DashboardShell role="school_admin" title={s.name} subtitle={`${[s.city, s.state].filter(Boolean).join(", ") || "Address pending"} · ${s.package} package`}>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={data.students.length} icon={Users} />
        <StatCard label="Classes" value={data.classes.length} icon={Building2} tone="violet" />
        <StatCard label="Batches" value={data.batches.length} icon={BookOpen} tone="sun" />
        <StatCard label="Teachers" value={data.teachers.length} icon={GraduationCap} tone="mint" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Classes">
          {data.classes.length === 0 ? <Empty>No classes yet.</Empty> : (
            <ul className="divide-y">
              {data.classes.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                  <span className="min-w-0 flex-1 truncate font-semibold">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.grade ? `Grade ${c.grade}` : ""}{c.section ? ` · ${c.section}` : ""}</span>
                  <span className="text-xs text-muted-foreground">{c.courses?.title ?? "No course"}</span>
                  <span className="text-xs text-muted-foreground">{c.teachers?.full_name ?? "No teacher"}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Batches">
          {data.batches.length === 0 ? <Empty>No batches yet.</Empty> : (
            <ul className="divide-y">
              {data.batches.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                  <span className="min-w-0 flex-1 truncate font-semibold">{b.name}</span>
                  <span className="text-xs text-muted-foreground">{b.courses?.title ?? "No course"}</span>
                  <span className="text-xs text-muted-foreground">{[b.schedule, b.timing].filter(Boolean).join(" · ") || "Timing not set"}</span>
                  <span className="text-xs text-muted-foreground">{b.teachers?.full_name ?? "No teacher"}</span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", b.status === "active" ? "bg-mint/15 text-mint" : "bg-muted text-muted-foreground")}>{b.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Students">
          {data.students.length === 0 ? <Empty>No students enrolled at your school yet.</Empty> : (
            <ul className="divide-y">
              {data.students.slice(0, 12).map((st) => (
                <li key={st.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
                  <span className="min-w-0 flex-1 truncate font-semibold">{st.full_name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{st.student_code}</span>
                  <span className="text-xs text-muted-foreground">{st.grade ? `Grade ${st.grade}` : ""}</span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", st.status === "active" ? "bg-mint/15 text-mint" : "bg-muted text-muted-foreground")}>{st.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Teachers">
            {data.teachers.length === 0 ? <Empty>No teachers added yet.</Empty> : (
              <ul className="divide-y">
                {data.teachers.map((t) => (
                  <li key={t.id} className="py-2.5 text-sm">
                    <div className="font-semibold">{t.full_name}</div>
                    <div className="text-xs text-muted-foreground">{t.specialization ?? "General"} · {t.experience_years} yrs · {t.email ?? "no email"}</div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Payments" action={<span className="text-sm font-bold text-mint">{formatINR(paid)} paid</span>}>
            {data.payments.length === 0 ? <Empty>No invoices or payments yet.</Empty> : (
              <ul className="divide-y">
                {data.payments.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-2.5 text-sm">
                    <Wallet className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{p.description ?? p.purpose}</span>
                    <span className="font-semibold">{formatINR(p.amount)}</span>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", p.status === "paid" ? "bg-mint/15 text-mint" : p.status === "pending" ? "bg-sun/15 text-sun-foreground" : "bg-muted text-muted-foreground")}>{p.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </DashboardShell>
  );
}
