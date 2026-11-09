import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Award, BadgeCheck, Loader2, SearchX } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PageHero, Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyCertificate } from "@/lib/certificates.functions";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/verify-certificate")({
  validateSearch: (s: Record<string, unknown>): { code?: string } => (typeof s.code === "string" ? { code: s.code.slice(0, 40) } : {}),
  head: () => ({ meta: pageMeta("Verify a Certificate", "Check that a LearningBIX course certificate is genuine using its certificate code.") }),
  component: Verify,
});

type Result = { student_name: string; course_title: string; issued_at: string } | null;

function Verify() {
  const search = Route.useSearch();
  const [code, setCode] = useState(search.code ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (code.trim().length < 4) return setError("Enter the code printed on the certificate.");
    setLoading(true);
    try {
      setResult(await verifyCertificate({ data: { code } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero crumbs={[{ label: "Verify Certificate" }]} eyebrow="Certificates" title="Verify a certificate" text="Enter the certificate code (for example LBX-CERT-1A2B3C4D5E) to confirm it was issued by LearningBIX." />
      <Section tone="white">
        <div className="mx-auto max-w-xl">
          <form onSubmit={onSubmit} className="rounded-[2rem] border bg-card p-6 shadow-soft sm:p-8">
            <Label htmlFor="code">Certificate code</Label>
            <div className="mt-2 flex gap-2">
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="LBX-CERT-XXXXXXXXXX" className="font-mono uppercase" autoComplete="off" />
              <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Verify"}</Button>
            </div>
            {error && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
          </form>
          <AnimatePresence mode="wait">
            {result !== undefined && (
              <motion.div key={result ? "ok" : "no"} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
                {result ? (
                  <div className="rounded-[2rem] border-2 border-mint bg-mint/10 p-8 text-center">
                    <BadgeCheck className="mx-auto size-14 text-mint" />
                    <h2 className="mt-3 text-2xl font-bold">Certificate is valid</h2>
                    <div className="mt-6 space-y-1">
                      <div className="text-sm text-muted-foreground">Awarded to</div>
                      <div className="font-display text-2xl font-extrabold">{result.student_name}</div>
                      <div className="mt-3 flex items-center justify-center gap-2 font-semibold"><Award className="size-5 text-sun" />{result.course_title}</div>
                      <div className="text-sm text-muted-foreground">Issued {new Date(result.issued_at).toLocaleDateString("en-IN", { dateStyle: "long" })}</div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[2rem] border-2 border-destructive/40 bg-destructive/5 p-8 text-center">
                    <SearchX className="mx-auto size-12 text-destructive" />
                    <h2 className="mt-3 text-xl font-bold">No certificate found</h2>
                    <p className="mt-2 text-muted-foreground">Check the code and try again. Codes are not case-sensitive.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
}
