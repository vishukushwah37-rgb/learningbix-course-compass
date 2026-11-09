import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AuthShell, GoogleButton, OrDivider } from "@/components/site/AuthShell";
import { FormField } from "@/components/site/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { destinationAfterLogin, rememberRedirect, takeRememberedRedirect } from "@/lib/post-login";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => (typeof s.redirect === "string" ? { redirect: s.redirect } : {}),
  head: () => ({ meta: pageMeta("Sign In", "Sign in to your LearningBIX account to continue learning, track progress and manage orders.") }),
  component: Login,
});

const schema = z.object({ email: z.string().trim().email("Enter a valid email"), password: z.string().min(1, "Enter your password") });

function Login() {
  const search = Route.useSearch();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  // Already signed in (or just came back from Google): send them on.
  useEffect(() => {
    if (loading || !user) return;
    const requested = search.redirect ?? takeRememberedRedirect();
    void destinationAfterLogin(user.id, requested).then((href) => router.navigate({ href, replace: true }));
  }, [user, loading, search.redirect, router]);

  async function onSubmit(v: z.infer<typeof schema>) {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(v);
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("Email not confirmed") ? "Please confirm your email first — check your inbox." : "Wrong email or password.");
      return;
    }
    toast.success("Welcome back!");
  }

  async function google() {
    setBusy(true);
    rememberRedirect(search.redirect);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/login` });
    if (res.error) {
      setBusy(false);
      toast.error("Google sign-in didn't work. Please try again.");
    }
  }

  return (
    <AuthShell title="Welcome back" text="Sign in to continue learning.">
      <GoogleButton onClick={google} loading={busy} />
      <OrDivider />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        </FormField>
        <FormField label="Password" htmlFor="password" error={form.formState.errors.password?.message}>
          <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
        </FormField>
        <div className="text-right text-sm"><Link to="/forgot-password" className="font-medium text-primary hover:underline">Forgot password?</Link></div>
        <Button type="submit" variant="brand" size="lg" className="w-full" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : "Sign in"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to LearningBIX? <Link to="/register" search={search.redirect ? { redirect: search.redirect } : {}} className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}
