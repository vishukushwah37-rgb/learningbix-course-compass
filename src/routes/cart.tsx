import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart – LearningBIX" },
      { name: "description", content: "Your cart." },
      { property: "og:title", content: "Cart – LearningBIX" },
      { property: "og:description", content: "Your cart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Cart" text="This page is being built in the next step. Your cart." />;
}
