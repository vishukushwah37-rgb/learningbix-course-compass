import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/franchisee")({
  head: () => ({
    meta: [
      { title: "Franchise – LearningBIX" },
      { name: "description", content: "Open your own LearningBIX centre." },
      { property: "og:title", content: "Franchise – LearningBIX" },
      { property: "og:description", content: "Open your own LearningBIX centre." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Franchise" text="This page is being built in the next step. Open your own LearningBIX centre." />;
}
