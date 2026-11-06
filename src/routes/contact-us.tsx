import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us – LearningBIX" },
      { name: "description", content: "Get in touch with LearningBIX." },
      { property: "og:title", content: "Contact Us – LearningBIX" },
      { property: "og:description", content: "Get in touch with LearningBIX." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Contact Us" text="This page is being built in the next step. Get in touch with LearningBIX." />;
}
