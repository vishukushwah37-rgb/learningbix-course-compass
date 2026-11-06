import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop – LearningBIX" },
      { name: "description", content: "Robotics and STEM kits." },
      { property: "og:title", content: "Shop – LearningBIX" },
      { property: "og:description", content: "Robotics and STEM kits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Shop" text="This page is being built in the next step. Robotics and STEM kits." />;
}
