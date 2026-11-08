import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Blocks, Bot, Brain, Code2, Cpu, Gamepad2, Play, Sparkles } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Stagger, StaggerItem, Reveal } from "@/components/site/motion";
import { FinalCta, IconBadge, TONES } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { img } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/bixcode")({
  head: () => ({ meta: pageMeta("BixCode – Coding Platform for Kids", "BixCode is LearningBIX's block and text coding platform for robotics, games and AI projects.") }),
  component: BixCode,
});

const FEATURES = [
  { icon: Blocks, title: "Drag-and-drop blocks", text: "Snap colourful blocks together — perfect for first-time coders." },
  { icon: Code2, title: "Switch to Python", text: "See every block as real Python and graduate to text coding." },
  { icon: Bot, title: "Control robots", text: "Upload programs to LearningBIX kits over USB or Bluetooth." },
  { icon: Brain, title: "AI blocks", text: "Train image and voice models and use them in projects." },
  { icon: Gamepad2, title: "Game studio", text: "Sprites, physics and scoring for building real games." },
  { icon: Cpu, title: "Simulator", text: "Test circuits and robots on screen before building." },
];

const BLOCKS = [
  { text: "when green flag clicked", tone: "bg-sun text-sun-foreground" },
  { text: "repeat 4 times", tone: "bg-primary text-primary-foreground", indent: 0 },
  { text: "move forward 20 cm", tone: "bg-violet text-violet-foreground", indent: 1 },
  { text: "turn right 90°", tone: "bg-violet text-violet-foreground", indent: 1 },
  { text: "if obstacle < 10 cm", tone: "bg-primary text-primary-foreground", indent: 1 },
  { text: "play sound beep", tone: "bg-mint text-mint-foreground", indent: 2 },
];

function BixCode() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "BixCode" }]}
        eyebrow="Coding platform"
        title={<>Meet <span className="text-gradient-brand">BixCode</span> — where blocks become robots</>}
        text="A friendly coding studio for kids aged 6–16. Start with blocks, grow into Python, and bring robots, games and AI projects to life."
        image={img.programCoding}
      >
        <Button asChild variant="brand" size="lg"><a href="/book-free-trial">Try it in a Free Class</a></Button>
        <Button asChild variant="outline" size="lg"><a href="/programs/coding">Coding Program</a></Button>
      </PageHero>

      <Section tone="white">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-[2rem] border bg-navy p-6 text-navy-foreground shadow-lift">
              <div className="mb-4 flex items-center gap-2 text-sm opacity-80">
                <span className="size-3 rounded-full bg-destructive" /><span className="size-3 rounded-full bg-sun" /><span className="size-3 rounded-full bg-mint" />
                <span className="ml-2">rover_patrol.bix</span>
                <Play className="ml-auto size-4" />
              </div>
              <div className="space-y-2">
                {BLOCKS.map((b, i) => (
                  <motion.div
                    key={b.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    style={{ marginLeft: `${(b.indent ?? 0) * 1.5}rem` }}
                    className={`w-fit rounded-xl px-4 py-2 font-mono text-sm font-semibold shadow-soft ${b.tone}`}
                  >
                    {b.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold sm:text-4xl">Code that kids can see moving</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every BixCode program can run on screen or on a real LearningBIX robot. Kids get instant feedback, which makes debugging feel like a game rather than a chore.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" /> Included with every LearningBIX course</div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Features" title="One studio, endless projects" />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <StaggerItem key={f.title}>
              <div className="h-full rounded-3xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <IconBadge tone={TONES[i % 4]}><f.icon /></IconBadge>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <FinalCta title="Ready to write your first program?" text="Join a free trial class and build something that moves." />
    </>
  );
}
