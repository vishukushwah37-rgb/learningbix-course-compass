import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/courses/$slug")({
  head: () => ({
    meta: [
      { title: "Course – LearningBIX" },
      { name: "description", content: "Course details." },
      { property: "og:title", content: "Course – LearningBIX" },
      { property: "og:description", content: "Course details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Course" text="This page is being built in the next step. Course details." />;
}
