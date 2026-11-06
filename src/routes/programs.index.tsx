import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Programs – LearningBIX" },
      { name: "description", content: "Robotics, coding, pre-school, STEM and AI programs." },
      { property: "og:title", content: "Programs – LearningBIX" },
      { property: "og:description", content: "Robotics, coding, pre-school, STEM and AI programs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Programs" text="This page is being built in the next step. Robotics, coding, pre-school, STEM and AI programs." />;
}
