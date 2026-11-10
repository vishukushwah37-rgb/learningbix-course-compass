import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Award, BookOpen, ClipboardList, Flame, PlayCircle } from "lucide-react";
import { DashboardShell, Empty, Panel, ProgressBar, StatCard } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { studentHomeQuery } from "@/lib/student.queries";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/student/dashboard")({
  head: () => ({ meta: [...pageMeta("Student Dashboard", "Your courses, quizzes and certificates."), { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentHomeQuery(context.userId)),
  component: StudentHome,
});

function StudentHome() {
  const { userId } = Route.useRouteContext();
  const { data } = useSuspenseQuery(studentHomeQuery(userId));
  const avg = data.enrollments.length ? Math.round(data.enrollments.reduce((n, e) => n + e.progress, 0) / data.enrollments.length) : 0;
  const best = data.attempts.length ? Math.max(...data.attempts.map((a) => (a.total ? Math.round((a.score / a.total) * 100) : 0))) : 0;
  const first = data.student?.full_name.split(" ")[0] ?? "there";
  return (
    <DashboardShell role="student" title={`Hi ${first}! 👋`} subtitle={data.student ? `Student ID ${data.student.student_code}` : undefined} actions={<Button asChild variant="brand"><Link to="/student/courses">Browse courses</Link></Button>}>
      {!data.student ? (
        <Empty>Your student profile isn't set up yet. Please contact LearningBIX support.</Empty>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Enrolled courses" value={data.enrollments.length} icon={BookOpen} />
            <StatCard label="Average progress" value={`${avg}%`} icon={Flame} tone="sun" />
            <StatCard label="Quizzes taken" value={data.attempts.length} icon={ClipboardList} tone="violet" hint={data.attempts.length ? `Best score ${best}%` : undefined} />
            <StatCard label="Certificates" value={data.certificates.length} icon={Award} tone="mint" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Panel title="Continue learning" action={<Link to="/student/courses" className="text-sm font-semibold text-primary">All courses</Link>}>
              {data.enrollments.length === 0 ? (
                <Empty>You haven't enrolled in a course yet. <Link to="/student/courses" className="font-semibold text-primary">Pick one</Link> to get started.</Empty>
              ) : (
                <ul className="space-y-3">
                  {data.enrollments.slice(0, 4).map((e) => e.courses && (
                    <li key={e.id} className="flex items-center gap-4 rounded-2xl border p-3">
                      <img src={e.courses.image_url ?? ""} alt="" className="size-16 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold">{e.courses.title}</div>
                        <div className="mt-2 flex items-center gap-3"><ProgressBar value={e.progress} /><span className="text-xs font-semibold">{e.progress}%</span></div>
                      </div>
                      <Button asChild size="sm"><Link to="/student/courses/$courseId" params={{ courseId: e.course_id }}><PlayCircle /> {e.progress ? "Resume" : "Start"}</Link></Button>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel title="Recent quiz results" action={<Link to="/student/quizzes" className="text-sm font-semibold text-primary">Quizzes</Link>}>
              {data.attempts.length === 0 ? <Empty>No quizzes taken yet.</Empty> : (
                <ul className="divide-y">
                  {data.attempts.slice(0, 5).map((a) => {
                    const pct = a.total ? Math.round((a.score / a.total) * 100) : 0;
                    return (
                      <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                        <span className="min-w-0 truncate font-medium">{a.quizzes?.title}</span>
                        <span className={pct >= 60 ? "font-bold text-mint" : "font-bold text-sun-foreground"}>{a.score}/{a.total}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
