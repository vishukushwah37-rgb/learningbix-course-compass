import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ClipboardList, PlayCircle } from "lucide-react";
import { DashboardShell, Empty, Panel, StatCard } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { studentHomeQuery } from "@/lib/student.queries";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/student/quizzes")({
  head: () => ({ meta: [...pageMeta("Quizzes", "Test what you have learned."), { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentHomeQuery(context.userId)),
  component: Quizzes,
});

function Quizzes() {
  const { userId } = Route.useRouteContext();
  const { data } = useSuspenseQuery(studentHomeQuery(userId));
  const enrolled = new Set(data.enrollments.map((e) => e.course_id));
  const quizzes = data.quizzes.filter((q) => q.course_id && enrolled.has(q.course_id));
  const best = (quizId: string) => {
    const mine = data.attempts.filter((a) => a.quiz_id === quizId);
    return mine.length ? Math.max(...mine.map((a) => (a.total ? Math.round((a.score / a.total) * 100) : 0))) : null;
  };

  return (
    <DashboardShell role="student" title="Quizzes" subtitle="Score at least the pass mark to pass a quiz.">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Quizzes available" value={quizzes.length} icon={ClipboardList} />
        <StatCard label="Attempts made" value={data.attempts.length} icon={ClipboardList} tone="violet" />
        <StatCard label="Passed" value={quizzes.filter((q) => (best(q.id) ?? 0) >= q.pass_mark).length} icon={ClipboardList} tone="mint" />
      </div>

      {quizzes.length === 0 ? (
        <Empty>Quizzes appear here once you're enrolled in a course. <Link to="/student/courses" className="font-semibold text-primary">See my courses</Link>.</Empty>
      ) : (
        <Panel title="Your quizzes">
          <ul className="divide-y">
            {quizzes.map((q) => {
              const pct = best(q.id);
              const passed = pct !== null && pct >= q.pass_mark;
              return (
                <li key={q.id} className="flex flex-wrap items-center gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{q.title}</div>
                    <div className="text-sm text-muted-foreground">{q.courses?.title} · pass mark {q.pass_mark}%</div>
                  </div>
                  {pct !== null && <span className={passed ? "text-sm font-bold text-mint" : "text-sm font-bold text-sun-foreground"}>Best {pct}%</span>}
                  <Button asChild size="sm" variant={pct === null ? "brand" : "outline"}><Link to="/student/quizzes/$id" params={{ id: q.id }}><PlayCircle /> {pct === null ? "Start" : "Retake"}</Link></Button>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </DashboardShell>
  );
}
