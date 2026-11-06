import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders – LearningBIX" },
      { name: "description", content: "Your order history." },
      { property: "og:title", content: "My Orders – LearningBIX" },
      { property: "og:description", content: "Your order history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="My Orders" text="This page is being built in the next step. Your order history." />;
}
