import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/site/AuthShell";
import { FormField } from "@/components/site/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: pageMeta("Forgot Password", "Reset the password for your LearningBIX account.") }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email");
    setError(undefined);
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    if (err) return void toast.error("Couldn't send the email. Please try again in a minute.");
    setSent(true);
  }

  return (
    <AuthShell title={sent ? "Check your email" : "Forgot your password?"} text={sent ? undefined : "Enter your email and we'll send you a link to set a new one."}>
      {sent ? (
        <div className="text-center">
          <MailCheck className="mx-auto size-14 text-mint" />
          <p className="mt-4 text-muted-foreground">If an account exists for <strong className="text-foreground">{email}</strong>, a reset link is on its way.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <FormField label="Email" htmlFor="email" error={error}>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <Button type="submit" variant="brand" size="lg" className="w-full" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : "Send reset link"}</Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link></p>
    </AuthShell>
  );
}
