import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { GraduationCap, Loader2, MailCheck, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AuthShell, GoogleButton, OrDivider } from "@/components/site/AuthShell";
import { FormField } from "@/components/site/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { rememberRedirect } from "@/lib/post-login";
import { registerSchema } from "@/lib/schemas";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => (typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {}),
  head: () => ({ meta: pageMeta("Create an Account", "Join LearningBIX as a student or parent to access courses, quizzes, progress tracking and certificates.") }),
  component: Register,
});

type Values = z.infer<typeof registerSchema>;

function Register() {
  const search = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(registerSchema), defaultValues: { full_name: "", email: "", phone: "", role: "student", password: "", confirm: "" } });
  const role = form.watch("role");

  async function onSubmit(v: Values) {
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: v.email,
      password: v.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: { full_name: v.full_name, phone: v.phone || null, role: v.role },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("registered") ? "That email already has an account. Try signing in." : error.message);
      return;
    }
    if (!data.session) setSentTo(v.email);
  }

  async function google() {
    setBusy(true);
    rememberRedirect(search.redirect);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/login` });
    if (res.error) {
      setBusy(false);
      toast.error("Google sign-up didn't work. Please try again.");
    }
  }

  if (sentTo) {
    return (
      <AuthShell title="Check your email">
        <div className="text-center">
          <MailCheck className="mx-auto size-14 text-mint" />
          <p className="mt-4 text-muted-foreground">We sent a confirmation link to <strong className="text-foreground">{sentTo}</strong>. Click it to activate your account, then sign in.</p>
          <Button asChild variant="outline" className="mt-6"><Link to="/login">Back to sign in</Link></Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create your account" text="Students and parents can sign up here. Schools, teachers and franchise partners get accounts from our team.">
      <GoogleButton onClick={google} loading={busy} />
      <p className="mt-2 text-center text-xs text-muted-foreground">Google sign-up creates a student account.</p>
      <OrDivider />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">I am a</legend>
          <div className="grid grid-cols-2 gap-3">
            {([["student", "Student", GraduationCap], ["parent", "Parent", Users]] as const).map(([val, label, Icon]) => (
              <button
                key={val}
                type="button"
                aria-pressed={role === val}
                onClick={() => form.setValue("role", val)}
                className={cn("flex items-center justify-center gap-2 rounded-2xl border-2 p-3 font-semibold transition", role === val ? "border-primary bg-primary/5 text-primary" : "hover:border-primary/50")}
              >
                <Icon className="size-5" /> {label}
              </button>
            ))}
          </div>
        </fieldset>
        <FormField label="Full name" htmlFor="full_name" error={form.formState.errors.full_name?.message}>
          <Input id="full_name" autoComplete="name" {...form.register("full_name")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          </FormField>
          <FormField label="Phone (optional)" htmlFor="phone" error={form.formState.errors.phone?.message}>
            <Input id="phone" type="tel" autoComplete="tel" {...form.register("phone")} />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Password" htmlFor="password" error={form.formState.errors.password?.message}>
            <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
          </FormField>
          <FormField label="Confirm password" htmlFor="confirm" error={form.formState.errors.confirm?.message}>
            <Input id="confirm" type="password" autoComplete="new-password" {...form.register("confirm")} />
          </FormField>
        </div>
        <Button type="submit" variant="brand" size="lg" className="w-full" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : "Create account"}</Button>
        <p className="text-center text-xs text-muted-foreground">By signing up you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.</p>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" search={search.redirect ? { redirect: search.redirect } : {}} className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
