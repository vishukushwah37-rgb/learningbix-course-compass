/** Builds the standard per-page meta tags (title, description, Open Graph, Twitter). */
export function pageMeta(title: string, description: string, image?: string | null) {
  const full = title.includes("LearningBIX") ? title : `${title} – LearningBIX`;
  const tags: { title?: string; name?: string; property?: string; content?: string }[] = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (image && /^https:\/\//.test(image)) {
    tags.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  }
  return tags;
}
