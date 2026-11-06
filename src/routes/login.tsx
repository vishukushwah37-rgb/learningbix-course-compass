import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login – LearningBIX" },
      { name: "description", content: "Sign in to LearningBIX." },
      { property: "og:title", content: "Login – LearningBIX" },
      { property: "og:description", content: "Sign in to LearningBIX." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PageHero eyebrow="Coming next" title="Login" text="This page is being built in the next step. Sign in to LearningBIX." />;
}
