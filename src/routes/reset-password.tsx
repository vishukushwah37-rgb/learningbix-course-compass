import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/site/AuthShell";
import { FormField } from "@/components/site/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [...pageMeta("Set a New Password", "Choose a new password for your LearningBIX account."), { name: "robots", content: "noindex" }] }),
  component: Reset,
});

function Reset() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return setError("At least 8 characters");
    if (pw !== confirm) return setError("Passwords don't match");
    setError(undefined);
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (err) return void toast.error(err.message);
    toast.success("Password updated");
    void navigate({ to: "/login" });
  }

  if (!loading && !session) {
    return (
      <AuthShell title="Link expired" text="This reset link is no longer valid. Request a new one.">
        <Button asChild variant="brand" className="w-full"><Link to="/forgot-password">Send a new link</Link></Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set a new password">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField label="New password" htmlFor="pw" error={error}>
          <Input id="pw" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </FormField>
        <FormField label="Confirm password" htmlFor="confirm">
          <Input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </FormField>
        <Button type="submit" variant="brand" size="lg" className="w-full" disabled={busy || loading}>{busy ? <Loader2 className="animate-spin" /> : "Update password"}</Button>
      </form>
    </AuthShell>
  );
}
