import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/verify-certificate")({
  head: () => ({
    meta: [
      { title: "Verify Certificate – LearningBIX" },
      { name: "description", content: "Check a LearningBIX certificate." },
      { property: "og:title", content: "Verify Certificate – LearningBIX" },
      { property: "og:description", content: "Check a LearningBIX certificate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Verify Certificate" text="This page is being built in the next step. Check a LearningBIX certificate." />;
}
