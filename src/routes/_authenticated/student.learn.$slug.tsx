import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, FileText, Loader2, PlayCircle, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell, Empty, Panel, ProgressBar } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { learnQuery } from "@/lib/student.queries";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/student/learn/$slug")({
  head: ({ params }) => ({ meta: [...pageMeta(`Learn ${params.slug.replace(/-/g, " ")}`, "Your LearningBIX lessons and progress."), { name: "robots", content: "noindex" }] }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(learnQuery(params.slug, context.userId)),
  component: Learn,
});

function Learn() {
  const { slug } = Route.useParams();
  const { userId } = Route.useRouteContext();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(learnQuery(slug, userId));
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const modules = [...(data.course?.course_modules ?? [])].sort((a, b) => a.position - b.position);
  const lessons = modules.flatMap((m) => [...(m.lessons ?? [])].sort((a, b) => a.position - b.position).map((l) => ({ ...l, module: m.title })));
  const current = lessons.find((l) => l.id === picked) ?? lessons.find((l) => !data.done.includes(l.id)) ?? lessons[0];
  const doneCount = lessons.filter((l) => data.done.includes(l.id)).length;

  async function markComplete(lessonId: string) {
    setBusy(true);
    const { error } = await supabase.rpc("complete_lesson", { _lesson_id: lessonId });
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success("Lesson completed!");
    await qc.invalidateQueries({ queryKey: ["learn"] });
    await qc.invalidateQueries({ queryKey: ["student-home"] });
    const next = lessons.find((l) => !data.done.includes(l.id) && l.id !== lessonId);
    if (next) setPicked(next.id);
  }

  if (!data.course) {
    return (
      <DashboardShell role="student" title="Course not found">
        <Empty>This course doesn't exist. <Link to="/programs" className="font-semibold text-primary">Browse programs</Link>.</Empty>
      </DashboardShell>
    );
  }

  if (!data.enrollment) {
    return (
      <DashboardShell role="student" title={data.course.title}>
        <Empty>
          You're not enrolled in this course yet. <Link to="/courses/$slug" params={{ slug }} className="font-semibold text-primary">See the course page</Link> or <Link to="/book-free-trial" className="font-semibold text-primary">book a free trial</Link>.
        </Empty>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="student" title={data.course.title} subtitle={`${doneCount} of ${lessons.length} lessons done`} actions={<Button asChild variant="outline"><Link to="/student/courses">All my courses</Link></Button>}>
      <div className="mb-6 flex items-center gap-4 rounded-3xl border bg-card p-5 shadow-soft">
        <div className="flex-1"><ProgressBar value={data.enrollment.progress} /></div>
        <span className="font-display text-2xl font-extrabold">{data.enrollment.progress}%</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {current ? (
          <Panel title={current.title}>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{current.module} · {current.duration_minutes} min</div>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/90">{current.content || "The lesson notes for this one are still being written. Ask your teacher or use the links below."}</p>

            {(current.video_url || current.pdf_url) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {current.video_url && <Button asChild variant="brand"><a href={current.video_url} target="_blank" rel="noreferrer"><Video /> Watch the video</a></Button>}
                {current.pdf_url && <Button asChild variant="outline"><a href={current.pdf_url} target="_blank" rel="noreferrer"><FileText /> Lesson sheet</a></Button>}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-5">
              {data.done.includes(current.id) ? (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-mint"><CheckCircle2 className="size-4" /> Lesson completed</span>
              ) : (
                <Button variant="brand" disabled={busy} onClick={() => void markComplete(current.id)}>
                  {busy ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Mark as complete
                </Button>
              )}
              <Button asChild variant="outline"><Link to="/student/quizzes">Take the quiz</Link></Button>
            </div>
          </Panel>
        ) : (
          <Empty>This course has no lessons yet.</Empty>
        )}

        <Panel title="Lessons">
          <ol className="space-y-4">
            {modules.map((m) => (
              <li key={m.id}>
                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{m.title}</div>
                <ul className="mt-2 space-y-1">
                  {[...(m.lessons ?? [])].sort((a, b) => a.position - b.position).map((l) => {
                    const done = data.done.includes(l.id);
                    const active = current?.id === l.id;
                    return (
                      <li key={l.id}>
                        <button
                          onClick={() => setPicked(l.id)}
                          className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition", active ? "bg-primary/10 font-semibold text-primary" : "hover:bg-muted")}
                        >
                          {done ? <CheckCircle2 className="size-4 shrink-0 text-mint" /> : <Circle className="size-4 shrink-0 text-muted-foreground" />}
                          <span className="min-w-0 flex-1 truncate">{l.title}</span>
                          <span className="text-[10px] text-muted-foreground">{l.duration_minutes}m</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
          {lessons.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <Button asChild variant="outline" className="w-full"><Link to="/student/quizzes/$id" params={{ id: "" }}><PlayCircle /> Skip to quizzes</Link></Button>
            </div>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
