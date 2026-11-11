import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Award, ClipboardList, Loader2, Package, Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell, Empty, Panel, ProgressBar, StatCard } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/site/FormField";
import { myOrdersQuery } from "@/lib/orders.queries";
import { parentHomeQuery } from "@/lib/parent.queries";
import { formatINR } from "@/lib/pricing";
import { pageMeta } from "@/lib/seo";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, statusTone, TONE_CLASS } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/parent/dashboard")({
  head: () => ({ meta: [...pageMeta("Parent Dashboard", "Track your child's LearningBIX progress."), { name: "robots", content: "noindex" }] }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(parentHomeQuery(context.userId)).then(() => context.queryClient.ensureQueryData(myOrdersQuery())),
  component: ParentHome,
});

function ParentHome() {
  const { userId } = Route.useRouteContext();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(parentHomeQuery(userId));
  const { data: orders } = useSuspenseQuery(myOrdersQuery());
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [age, setAge] = useState("");
  const [busy, setBusy] = useState(false);

  async function addChild() {
    if (!data.parent) return;
    if (name.trim().length < 2) return void toast.error("Enter your child's name");
    setBusy(true);
    const { error } = await supabase
      .from("students")
      .insert({ parent_id: data.parent.id, full_name: name.trim(), grade: grade.trim() || null, age: age ? Number(age) : null });
    setBusy(false);
    if (error) return void toast.error("We couldn't add your child. Please check the details and try again.");
    toast.success("Child added!");
    setName("");
    setGrade("");
    setAge("");
    setAdding(false);
    await qc.invalidateQueries({ queryKey: ["parent-home"] });
  }

  const avg = data.enrollments.length ? Math.round(data.enrollments.reduce((n, e) => n + e.progress, 0) / data.enrollments.length) : 0;
  const first = data.parent?.full_name.split(" ")[0] ?? "there";

  return (
    <DashboardShell
      role="parent"
      title={`Hi ${first}! 👋`}
      subtitle="Your children's courses, quiz results and certificates."
      actions={data.parent ? <Button variant="brand" onClick={() => setAdding((v) => !v)}><UserPlus /> Add child</Button> : undefined}
    >
      {!data.parent ? (
        <Empty>Your parent profile isn't set up yet. Please contact LearningBIX support.</Empty>
      ) : (
        <div className="space-y-6">
          {adding && (
            <Panel title="Add a child">
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField label="Child's name" htmlFor="ch-name"><Input id="ch-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" /></FormField>
                <FormField label="Grade" htmlFor="ch-grade"><Input id="ch-grade" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="5" /></FormField>
                <FormField label="Age" htmlFor="ch-age"><Input id="ch-age" type="number" min={3} max={18} value={age} onChange={(e) => setAge(e.target.value)} placeholder="10" /></FormField>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="brand" disabled={busy} onClick={() => void addChild()}>{busy ? <Loader2 className="animate-spin" /> : <Plus />} Save child</Button>
                <Button variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
              </div>
            </Panel>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Children" value={data.children.length} icon={UserPlus} />
            <StatCard label="Average progress" value={`${avg}%`} icon={ClipboardList} tone="sun" />
            <StatCard label="Quiz attempts" value={data.attempts.length} icon={ClipboardList} tone="violet" />
            <StatCard label="Certificates" value={data.certificates.length} icon={Award} tone="mint" />
          </div>

          {data.children.length === 0 ? (
            <Empty>No children linked yet. Use <strong>Add child</strong> above to bring them onto the platform.</Empty>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {data.children.map((child) => {
                const enr = data.enrollments.filter((e) => e.student_id === child.id);
                const att = data.attempts.filter((a) => a.student_id === child.id);
                const certs = data.certificates.filter((c) => c.student_id === child.id);
                const cavg = enr.length ? Math.round(enr.reduce((n, e) => n + e.progress, 0) / enr.length) : 0;
                return (
                  <Panel key={child.id} title={child.full_name} action={<span className="text-xs font-semibold text-muted-foreground">{child.student_code}</span>}>
                    <div className="text-sm text-muted-foreground">{child.grade ? `Grade ${child.grade}` : "Grade not set"} · {child.age ? `${child.age} years` : "Age not set"}</div>
                    <div className="mt-3 flex items-center gap-3"><ProgressBar value={cavg} /><span className="text-xs font-semibold">{cavg}%</span></div>
                    {enr.length === 0 ? (
                      <p className="mt-4 text-sm text-muted-foreground">No courses yet. <Link to="/programs" className="font-semibold text-primary">Browse programs</Link> or book a free trial.</p>
                    ) : (
                      <ul className="mt-4 space-y-2">
                        {enr.map((e) => (
                          <li key={e.id} className="flex items-center gap-3 rounded-xl border p-3">
                            <img src={e.courses?.image_url ?? ""} alt="" className="size-12 rounded-lg object-cover" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold">{e.courses?.title}</div>
                              <div className="mt-1 flex items-center gap-2"><ProgressBar value={e.progress} /><span className="text-xs">{e.progress}%</span></div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {att.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Quiz results</div>
                        <ul className="mt-2 divide-y">
                          {att.slice(0, 4).map((a) => {
                            const pct = a.total ? Math.round((a.score / a.total) * 100) : 0;
                            return (
                              <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                                <span className="min-w-0 truncate">{a.quizzes?.title}</span>
                                <span className={cn("font-bold", pct >= 60 ? "text-mint" : "text-sun-foreground")}>{a.score}/{a.total}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    {certs.length > 0 && (
                      <div className="mt-4 border-t pt-3 text-sm">
                        <Award className="mr-1 inline size-4 text-mint" /> {certs.length} certificate{certs.length === 1 ? "" : "s"} earned
                      </div>
                    )}
                  </Panel>
                );
              })}
            </div>
          )}

          <Panel title="Recent orders" action={<Button asChild size="sm" variant="outline"><Link to="/orders">All orders</Link></Button>}>
            {orders.length === 0 ? (
              <Empty>No orders yet. <Link to="/shop" className="font-semibold text-primary">Shop robotics kits</Link>.</Empty>
            ) : (
              <ul className="divide-y">
                {orders.slice(0, 4).map((o) => (
                  <li key={o.id}>
                    <Link to="/orders/$id" params={{ id: o.id }} search={{}} className="flex items-center gap-3 py-3 text-sm hover:underline">
                      <Package className="size-4 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate font-semibold">{o.order_number}</span>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", TONE_CLASS[statusTone(o.status)])}>{ORDER_STATUS_LABEL[o.status] ?? o.status}</span>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", TONE_CLASS[statusTone(o.payment_status)])}>{PAYMENT_STATUS_LABEL[o.payment_status] ?? o.payment_status}</span>
                      <span className="font-bold">{formatINR(o.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </DashboardShell>
  );
}
