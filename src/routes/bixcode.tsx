import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/bixcode")({
  head: () => ({
    meta: [
      { title: "BixCode – LearningBIX" },
      { name: "description", content: "Block and text coding platform." },
      { property: "og:title", content: "BixCode – LearningBIX" },
      { property: "og:description", content: "Block and text coding platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="BixCode" text="This page is being built in the next step. Block and text coding platform." />;
}
