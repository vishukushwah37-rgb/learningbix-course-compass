import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StatusPicker } from "@/components/dash/StatusPicker";
import { DashboardShell, Empty, Panel, StatCard } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { franchiseEnquiriesQuery, franchiseHomeQuery } from "@/lib/org.queries";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

const STATUSES = ["new", "contacted", "converted", "closed"] as const;

export const Route = createFileRoute("/_authenticated/franchise/enquiries")({
  head: () => ({ meta: [...pageMeta("Centre Enquiries", "Leads sent to your LearningBIX centre."), { name: "robots", content: "noindex" }] }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(franchiseHomeQuery(context.userId)).then((res) =>
      res.franchise ? context.queryClient.ensureQueryData(franchiseEnquiriesQuery(res.franchise.id)) : Promise.resolve(null),
    ),
  component: FranchiseEnquiries,
});

function FranchiseEnquiries() {
  const { userId } = Route.useRouteContext();
  const qc = useQueryClient();
  const { data: home } = useSuspenseQuery(franchiseHomeQuery(userId));
  const { data: rows } = useSuspenseQuery(franchiseEnquiriesQuery(home.franchise!.id));

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) return void toast.error("We couldn't update that enquiry.");
    toast.success("Enquiry updated");
    await qc.invalidateQueries({ queryKey: ["franchise-enquiries"] });
  }

  if (!home.franchise) {
    return (
      <DashboardShell role="franchise" title="Enquiries">
        <Empty>No centre is linked to this account yet, so there are no enquiries to show.</Empty>
      </DashboardShell>
    );
  }

  const open = rows.filter((r) => r.status === "new").length;

  return (
    <DashboardShell role="franchise" title="Enquiries" subtitle="Leads the LearningBIX team has routed to your centre." actions={<Button asChild variant="outline"><Link to="/franchise/dashboard">Back to overview</Link></Button>}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total enquiries" value={rows.length} icon={Mail} />
        <StatCard label="Waiting for you" value={open} icon={Mail} tone="sun" />
        <StatCard label="Converted" value={rows.filter((r) => r.status === "converted").length} icon={Mail} tone="mint" />
      </div>

      {rows.length === 0 ? (
        <Empty>No enquiries yet. New leads from the website land here automatically.</Empty>
      ) : (
        <Panel title="All enquiries">
          <ul className="divide-y">
            {rows.map((r) => (
              <li key={r.id} className="py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="min-w-0 flex-1 truncate font-semibold">{r.name}</span>
                  {r.program && <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">{r.program}</span>}
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                  <StatusPicker label={`Status for ${r.name}`} value={r.status} options={STATUSES} onSave={(v) => setStatus(r.id, v)} />
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{[r.email, r.phone].filter(Boolean).join(" · ") || "No contact details"}</div>
                {r.subject && <div className="mt-1 text-sm font-medium">{r.subject}</div>}
                {r.message && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{r.message}</p>}
                {r.child_name && <div className="mt-1 text-xs text-muted-foreground">For {r.child_name}{r.child_age ? `, age ${r.child_age}` : ""}</div>}
                <div className={cn("mt-2 text-xs", r.follow_up_date ? "font-semibold text-primary" : "hidden")}>Follow up {r.follow_up_date ? new Date(r.follow_up_date).toLocaleDateString("en-IN", { dateStyle: "medium" }) : ""}</div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </DashboardShell>
  );
}
