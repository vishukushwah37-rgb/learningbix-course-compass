import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/learning-center/")({
  head: () => ({
    meta: [
      { title: "Learning Center – LearningBIX" },
      { name: "description", content: "Free DIY project library." },
      { property: "og:title", content: "Learning Center – LearningBIX" },
      { property: "og:description", content: "Free DIY project library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Learning Center" text="This page is being built in the next step. Free DIY project library." />;
}
