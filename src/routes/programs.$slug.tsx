import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/programs/$slug")({
  head: () => ({
    meta: [
      { title: "Program – LearningBIX" },
      { name: "description", content: "Program details." },
      { property: "og:title", content: "Program – LearningBIX" },
      { property: "og:description", content: "Program details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Program" text="This page is being built in the next step. Program details." />;
}
