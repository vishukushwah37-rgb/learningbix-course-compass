import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Award, Printer, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, Empty, Panel, StatCard } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { studentHomeQuery } from "@/lib/student.queries";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/student/certificates")({
  head: () => ({ meta: [...pageMeta("My Certificates", "Certificates you have earned at LearningBIX."), { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentHomeQuery(context.userId)),
  component: Certificates,
});

function Certificates() {
  const { userId } = Route.useRouteContext();
  const { data } = useSuspenseQuery(studentHomeQuery(userId));

  return (
    <DashboardShell role="student" title="My certificates" subtitle="Every course you finished earns a certificate you can share.">
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Certificates earned" value={data.certificates.length} icon={Award} tone="mint" />
        <StatCard label="Courses completed" value={data.enrollments.filter((e) => e.progress >= 100).length} icon={Award} tone="sun" />
      </div>

      {data.certificates.length === 0 ? (
        <Empty>Finish all the lessons in a course to earn its certificate. <Link to="/student/courses" className="font-semibold text-primary">My courses</Link>.</Empty>
      ) : (
        <div className="space-y-5">
          {data.certificates.map((c) => (
            <Panel key={c.id} title={c.courses?.title ?? "Course"}>
              <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
                <Award className="mx-auto size-10 text-primary" />
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">LearningBIX certificate of completion</div>
                <div className="mt-2 font-display text-2xl font-extrabold">{data.student?.full_name}</div>
                <div className="mt-1 text-sm text-muted-foreground">for completing {c.courses?.title}</div>
                <div className="mt-4 font-mono text-sm font-semibold">{c.certificate_code}</div>
                <div className="text-xs text-muted-foreground">Issued {new Date(c.issued_at).toLocaleDateString("en-IN", { dateStyle: "long" })}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="brand" onClick={() => window.print()}><Printer /> Save as PDF</Button>
                <Button asChild variant="outline"><Link to="/verify-certificate" search={{ code: c.certificate_code }}><ShieldCheck /> Verify this one</Link></Button>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
