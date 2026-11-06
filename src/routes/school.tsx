import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/school")({
  head: () => ({
    meta: [
      { title: "For Schools – LearningBIX" },
      { name: "description", content: "Innovation labs and curriculum for schools." },
      { property: "og:title", content: "For Schools – LearningBIX" },
      { property: "og:description", content: "Innovation labs and curriculum for schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="For Schools" text="This page is being built in the next step. Innovation labs and curriculum for schools." />;
}
