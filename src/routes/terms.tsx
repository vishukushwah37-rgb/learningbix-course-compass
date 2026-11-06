import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions – LearningBIX" },
      { name: "description", content: "LearningBIX terms of use." },
      { property: "og:title", content: "Terms & Conditions – LearningBIX" },
      { property: "og:description", content: "LearningBIX terms of use." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Terms & Conditions" text="This page is being built in the next step. LearningBIX terms of use." />;
}
