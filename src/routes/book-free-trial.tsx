import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/book-free-trial")({
  head: () => ({
    meta: [
      { title: "Book a Free Trial – LearningBIX" },
      { name: "description", content: "Book a free trial class." },
      { property: "og:title", content: "Book a Free Trial – LearningBIX" },
      { property: "og:description", content: "Book a free trial class." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Book a Free Trial" text="This page is being built in the next step. Book a free trial class." />;
}
