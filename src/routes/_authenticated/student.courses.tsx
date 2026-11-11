import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, PlayCircle } from "lucide-react";
import { DashboardShell, Empty, Panel, ProgressBar, StatCard } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { studentHomeQuery } from "@/lib/student.queries";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/student/courses")({
  head: () => ({ meta: [...pageMeta("My Courses", "Every course you are learning at LearningBIX."), { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentHomeQuery(context.userId)),
  component: MyCourses,
});

function MyCourses() {
  const { userId } = Route.useRouteContext();
  const { data } = useSuspenseQuery(studentHomeQuery(userId));
  const running = data.enrollments.filter((e) => e.progress < 100);
  const finished = data.enrollments.filter((e) => e.progress >= 100);

  return (
    <DashboardShell role="student" title="My courses" subtitle="Pick up where you left off." actions={<Button asChild variant="brand"><Link to="/programs">Browse more courses</Link></Button>}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Enrolled" value={data.enrollments.length} icon={BookOpen} />
        <StatCard label="In progress" value={running.length} icon={PlayCircle} tone="sun" />
        <StatCard label="Completed" value={finished.length} icon={BookOpen} tone="mint" />
      </div>

      {data.enrollments.length === 0 ? (
        <Empty>You're not enrolled in a course yet. <Link to="/programs" className="font-semibold text-primary">Browse programs</Link> or <Link to="/book-free-trial" className="font-semibold text-primary">book a free trial</Link>.</Empty>
      ) : (
        <Panel title="Your courses">
          <ul className="grid gap-4 md:grid-cols-2">
            {data.enrollments.map((e) => {
              const course = e.courses;
              if (!course) return null;
              return (
                <li key={e.id} className="flex flex-col overflow-hidden rounded-2xl border bg-card">
                  <img src={course.image_url ?? ""} alt="" className="h-36 w-full object-cover" />
                  <div className="flex flex-1 flex-col p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{course.level}</div>
                    <div className="mt-1 font-bold">{course.title}</div>
                    <div className="mt-3 flex items-center gap-3"><ProgressBar value={e.progress} /><span className="text-xs font-semibold">{e.progress}%</span></div>
                    <div className="mt-4 flex gap-2">
                      <Button asChild size="sm" variant="brand"><Link to="/student/learn/$slug" params={{ slug: course.slug }}><PlayCircle /> {e.progress ? "Resume" : "Start"}</Link></Button>
                      <Button asChild size="sm" variant="outline"><Link to="/courses/$slug" params={{ slug: course.slug }}>Details</Link></Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </DashboardShell>
  );
}
