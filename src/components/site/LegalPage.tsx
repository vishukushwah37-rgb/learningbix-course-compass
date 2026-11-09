import type { ReactNode } from "react";
import { PageHero, Section, DemoNote } from "./Section";

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { heading: string; body: ReactNode }[] }) {
  return (
    <>
      <PageHero crumbs={[{ label: title }]} title={title} text={`Last updated ${updated}`} />
      <Section tone="white">
        <article className="mx-auto max-w-3xl">
          <DemoNote>Template text — have a lawyer review before publishing</DemoNote>
          {sections.map((s, i) => (
            <section key={s.heading} className="mt-8">
              <h2 className="text-xl font-bold">{i + 1}. {s.heading}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">{s.body}</div>
            </section>
          ))}
        </article>
      </Section>
    </>
  );
}
