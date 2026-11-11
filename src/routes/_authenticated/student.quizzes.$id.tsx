import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Award, Loader2, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell, Empty, Panel } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { quizQuestionsQuery, studentHomeQuery } from "@/lib/student.queries";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/student/quizzes/$id")({
  head: () => ({ meta: [...pageMeta("Quiz", "Answer the questions and see your score right away."), { name: "robots", content: "noindex" }] }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(quizQuestionsQuery(params.id)).then(() => context.queryClient.ensureQueryData(studentHomeQuery(context.userId))),
  component: QuizRunner,
});

type Answers = Record<string, number>;

function QuizRunner() {
  const { id } = Route.useParams();
  const { userId } = Route.useRouteContext();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(quizQuestionsQuery(id));
  const home = useSuspenseQuery(studentHomeQuery(userId));
  const [answers, setAnswers] = useState<Answers>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  const enrolled = Boolean(data.quiz?.course_id && home.data.enrollments.some((e) => e.course_id === data.quiz?.course_id));
  const answered = Object.keys(answers).length;
  const total = data.questions.length;

  async function submit() {
    if (!data.quiz) return;
    setBusy(true);
    const { data: res, error } = await supabase.rpc("submit_quiz", { _quiz_id: data.quiz.id, _answers: answers });
    setBusy(false);
    if (error) return void toast.error(error.message);
    const score = Number((res as { score?: number } | null)?.score ?? 0);
    const tot = Number((res as { total?: number } | null)?.total ?? total);
    setResult({ score, total: tot });
    await qc.invalidateQueries({ queryKey: ["student-home"] });
  }

  if (!data.quiz) {
    return (
      <DashboardShell role="student" title="Quiz not found">
        <Empty>That quiz doesn't exist. <Link to="/student/quizzes" className="font-semibold text-primary">Back to quizzes</Link>.</Empty>
      </DashboardShell>
    );
  }

  if (!enrolled) {
    return (
      <DashboardShell role="student" title={data.quiz.title}>
        <Empty>You need to be enrolled in this course to take the quiz. <Link to="/student/courses" className="font-semibold text-primary">My courses</Link>.</Empty>
      </DashboardShell>
    );
  }

  const pct = result ? Math.round((result.score / result.total) * 100) : 0;
  const passed = result ? pct >= data.quiz.pass_mark : false;

  if (result) {
    return (
      <DashboardShell role="student" title={data.quiz.title}>
        <div className={cn("mx-auto max-w-lg rounded-[2rem] border-2 p-10 text-center", passed ? "border-mint bg-mint/10" : "border-sun/40 bg-sun/10")}>
          {passed ? <Trophy className="mx-auto size-14 text-mint" /> : <Award className="mx-auto size-14 text-sun-foreground" />}
          <div className="mt-4 font-display text-5xl font-extrabold">{result.score}/{result.total}</div>
          <div className="mt-1 text-lg font-semibold">{pct}% · {passed ? "Passed" : `Pass mark is ${data.quiz.pass_mark}%`}</div>
          <p className="mt-3 text-sm text-muted-foreground">{passed ? "Great work! Keep going with your lessons." : "Review the lesson and try again — you can retake this quiz."}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button asChild variant="brand"><Link to="/student/quizzes">More quizzes</Link></Button>
            <Button variant="outline" onClick={() => { setResult(null); setAnswers({}); }}>Try again</Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="student" title={data.quiz.title} subtitle={`${answered} of ${total} answered`} actions={<Button asChild variant="outline"><Link to="/student/quizzes">Cancel</Link></Button>}>
      {total === 0 ? (
        <Empty>This quiz has no questions yet.</Empty>
      ) : (
        <div className="space-y-4">
          {data.questions.map((q, i) => (
            <Panel key={q.id} title={`${i + 1}. ${q.question}`}>
              <div className="grid gap-2">
                {q.options.map((opt, idx) => (
                  <label key={idx} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition", answers[q.id] === idx ? "border-primary bg-primary/10 font-semibold" : "hover:bg-muted")}>
                    <input
                      type="radio"
                      name={q.id}
                      className="size-4 accent-[var(--primary)]"
                      checked={answers[q.id] === idx}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </Panel>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border bg-card p-5 shadow-soft">
            <span className="text-sm text-muted-foreground">{total - answered} question{total - answered === 1 ? "" : "s"} left</span>
            <Button variant="brand" disabled={busy || answered === 0} onClick={() => void submit()}>
              {busy ? <Loader2 className="animate-spin" /> : null} Submit quiz
            </Button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
