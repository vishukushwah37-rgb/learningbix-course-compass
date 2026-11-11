import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, Mail, Store, Users, Wallet } from "lucide-react";
import { DashboardShell, Empty, Panel, StatCard } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { franchiseHomeQuery } from "@/lib/org.queries";
import { formatINR } from "@/lib/pricing";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/franchise/dashboard")({
  head: () => ({ meta: [...pageMeta("Franchise Dashboard", "Your LearningBIX centre: learners, batches, enquiries and payments."), { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(franchiseHomeQuery(context.userId)),
  component: FranchiseHome,
});

function FranchiseHome() {
  const { userId } = Route.useRouteContext();
  const { data } = useSuspenseQuery(franchiseHomeQuery(userId));

  if (!data.franchise) {
    return (
      <DashboardShell role="franchise" title="Franchise dashboard">
        <Empty>
          No LearningBIX centre is linked to this account yet. Once our franchise team activates your centre, your learners, batches and enquiries show up here.
          <div className="mt-4"><Button asChild variant="brand"><Link to="/franchisee">Apply for a franchise</Link></Button></div>
        </Empty>
      </DashboardShell>
    );
  }

  const f = data.franchise;
  const paid = data.payments.filter((p) => p.status === "paid").reduce((n, p) => n + Number(p.amount), 0);
  const newEnquiries = data.enquiries.filter((e) => e.status === "new").length;

  return (
    <DashboardShell
      role="franchise"
      title={f.name}
      subtitle={`${[f.city, f.state].filter(Boolean).join(", ") || "Location pending"} · centre status ${f.status}`}
      actions={<Button asChild variant="outline"><Link to="/franchise/enquiries">Enquiries{newEnquiries ? ` (${newEnquiries})` : ""}</Link></Button>}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={data.students.length} icon={Users} />
        <StatCard label="Batches" value={data.batches.length} icon={BookOpen} tone="sun" />
        <StatCard label="Teachers" value={data.teachers.length} icon={Store} tone="violet" />
        <StatCard label="Collected" value={formatINR(paid)} icon={Wallet} tone="mint" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Batches">
          {data.batches.length === 0 ? <Empty>No batches running yet.</Empty> : (
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

        <Panel title="New enquiries" action={<Button asChild size="sm" variant="outline"><Link to="/franchise/enquiries">Open all</Link></Button>}>
          {data.enquiries.length === 0 ? <Empty>No enquiries routed to your centre yet.</Empty> : (
            <ul className="divide-y">
              {data.enquiries.slice(0, 6).map((e) => (
                <li key={e.id} className="py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate font-semibold">{e.name}</span>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", e.status === "new" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>{e.status}</span>
                  </div>
                  <div className="mt-1 pl-6 text-xs text-muted-foreground">{e.email ?? e.phone ?? ""} · {new Date(e.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Students">
          {data.students.length === 0 ? <Empty>No learners enrolled at your centre yet.</Empty> : (
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
    </DashboardShell>
  );
}
