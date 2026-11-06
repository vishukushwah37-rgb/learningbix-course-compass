import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us – LearningBIX" },
      { name: "description", content: "Our story, mission and team." },
      { property: "og:title", content: "About Us – LearningBIX" },
      { property: "og:description", content: "Our story, mission and team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="About Us" text="This page is being built in the next step. Our story, mission and team." />;
}
