import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/shop/$slug")({
  head: () => ({
    meta: [
      { title: "Product – LearningBIX" },
      { name: "description", content: "Product details." },
      { property: "og:title", content: "Product – LearningBIX" },
      { property: "og:description", content: "Product details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Product" text="This page is being built in the next step. Product details." />;
}
