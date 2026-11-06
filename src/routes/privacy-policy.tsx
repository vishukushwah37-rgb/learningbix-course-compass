import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy – LearningBIX" },
      { name: "description", content: "How LearningBIX handles your data." },
      { property: "og:title", content: "Privacy Policy – LearningBIX" },
      { property: "og:description", content: "How LearningBIX handles your data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Privacy Policy" text="This page is being built in the next step. How LearningBIX handles your data." />;
}
