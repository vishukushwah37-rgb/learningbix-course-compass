import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Brain, Code2, Cpu, Lightbulb, Puzzle, Sparkles, Target, TrendingUp, Wand2, Blocks as BlocksIcon, Baby, FlaskConical, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, Eyebrow } from "@/components/site/Section";
import { Counter, Floating, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { FinalCta, IconBadge, PartnerGrid, Testimonials, TONES } from "@/components/site/Blocks";
import { CourseCard, ProductCard } from "@/components/site/Cards";
import { EXPERIENCE, GALLERY, SKILLS, STATS, WHY_CHOOSE, WHY_ROBOTICS } from "@/data/site";
import { PROGRAMS } from "@/data/programs";
import { img } from "@/lib/images";
import { coursesQuery, productsQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LearningBIX – Robotics, Coding, AI & STEM Learning for Kids" },
      { name: "description", content: "Empowering young minds to build the future with hands-on robotics, coding, AI and STEM programs, kits and school labs." },
      { property: "og:title", content: "LearningBIX – Empowering Young Minds to Build the Future" },
      { property: "og:description", content: "Robotics, coding, AI and STEM programs, DIY kits and innovation labs for kids and schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(productsQuery()), context.queryClient.ensureQueryData(coursesQuery())]),
  component: Home,
});

const SKILL_ICONS = [Brain, Puzzle, Wand2, Target, TrendingUp, Lightbulb];
const OFFER_ICONS = [Bot, Code2, Baby, FlaskConical];
const POPULAR = ["beginner-robotics", "advanced-robotics", "python-programming", "scratch-coding", "artificial-intelligence", "iot-and-electronics"];

function Home() {
  const { data: shop } = useSuspenseQuery(productsQuery());
  const { data: courses } = useSuspenseQuery(coursesQuery());
  const popular = POPULAR.map((s) => courses.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const featured = shop.products.filter((p) => p.is_featured);
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(GALLERY.map((g) => g.category)))];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-glow">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
        <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <Stagger>
            <StaggerItem><Eyebrow>Robotics · Coding · AI · STEM</Eyebrow></StaggerItem>
            <StaggerItem>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
                Empowering Young Minds to <span className="text-gradient-brand">Build the Future</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
                Discover the world of Robotics, Coding, AI and STEM through interactive learning experiences.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="brand"><Link to="/programs">Explore Programs <ArrowRight /></Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/book-free-trial">Book a Free Trial</Link></Button>
              </div>
            </StaggerItem>
          </Stagger>
          <div className="relative">
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-gradient-brand opacity-25 blur-3xl" aria-hidden />
              <img src={img.heroKidsRobotics} alt="Children building a robot together" width={1536} height={1152} className="relative aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-lift" />
            </motion.div>
            <Floating className="absolute -left-4 top-8 sm:-left-10">
              <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-soft">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Cpu className="size-5" /></span>
                <div><div className="text-sm font-bold">Real robot kits</div><div className="text-xs text-muted-foreground">Delivered home</div></div>
              </div>
            </Floating>
            <Floating className="absolute -bottom-6 right-2 sm:-right-6" delay={1.5}>
              <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-soft">
                <span className="grid size-10 place-items-center rounded-xl bg-sun/20 text-sun-foreground"><Sparkles className="size-5" /></span>
                <div><div className="text-sm font-bold">Live mentors</div><div className="text-xs text-muted-foreground">Small batches</div></div>
              </div>
            </Floating>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-page -mt-4 relative z-10">
        <div className="grid grid-cols-2 gap-4 rounded-[2rem] border bg-card p-6 shadow-soft lg:grid-cols-4 lg:p-8">
          {STATS.map((s, i) => (
            <div key={s.label} className="text-center">
              <div className={cn("font-display text-3xl font-extrabold sm:text-4xl", ["text-primary", "text-violet", "text-sun", "text-mint"][i])}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OFFER */}
      <Section>
        <SectionHeading eyebrow="What we offer" title="Programs that turn curiosity into creation" text="Four learning tracks designed for every age and interest." />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.slice(0, 4).map((p, i) => {
            const Icon = OFFER_ICONS[i]!;
            return (
              <StaggerItem key={p.slug}>
                <motion.article whileHover={{ y: -6 }} className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-soft">
                  <div className="aspect-[4/3] overflow-hidden"><img src={p.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                  <div className="flex flex-1 flex-col p-6">
                    <IconBadge tone={TONES[i % 4]}><Icon /></IconBadge>
                    <h3 className="mt-4 text-xl font-bold">{p.name === "Robotics" ? "Robotics Education" : p.name === "Coding" ? "Coding Education" : p.name === "Pre-School" ? "Pre-School Learning" : p.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.short}</p>
                    <Link to="/programs/$slug" params={{ slug: p.slug }} className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-primary">Explore More <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
                  </div>
                </motion.article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      {/* SKILLS */}
      <Section tone="white">
        <SectionHeading eyebrow="What kids achieve" title="Skills that last a lifetime" />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((s, i) => {
            const Icon = SKILL_ICONS[i]!;
            return (
              <StaggerItem key={s.title}>
                <div className="flex h-full gap-4 rounded-3xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-soft">
                  <IconBadge tone={TONES[i % 4]}><Icon /></IconBadge>
                  <div><h3 className="font-bold">{s.title}</h3><p className="mt-1 text-sm text-muted-foreground">{s.text}</p></div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      {/* EXPERIENCE */}
      <Section tone="navy" className="relative overflow-hidden">
        <SectionHeading eyebrow="The LearningBIX experience" title={<span className="text-navy-foreground">Six steps from spark to invention</span>} />
        <div className="relative grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-brand lg:block" aria-hidden />
          {EXPERIENCE.map((e, i) => (
            <Reveal key={e.step} delay={i * 0.08} className="relative text-center">
              <div className="relative mx-auto grid size-16 place-items-center rounded-full bg-gradient-brand font-display text-xl font-extrabold shadow-glow">{i + 1}</div>
              <h3 className="mt-4 text-lg font-bold">{e.step}</h3>
              <p className="mt-1 text-sm text-navy-foreground/70">{e.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* WHY ROBOTICS */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal><img src={img.programRobotics} alt="Child building a sensor robot" loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" /></Reveal>
          <div>
            <SectionHeading align="left" eyebrow="Why robotics for kids?" title="The most hands-on way to learn tech" className="mb-8" />
            <div className="grid gap-4 sm:grid-cols-2">
              {WHY_ROBOTICS.map((w) => (
                <div key={w.title} className="rounded-2xl border bg-card p-4"><h3 className="font-bold">{w.title}</h3><p className="mt-1 text-sm text-muted-foreground">{w.text}</p></div>
              ))}
            </div>
            <Button asChild variant="brand" size="lg" className="mt-8"><Link to="/programs/$slug" params={{ slug: "robotics" }}>Explore Robotics <ArrowRight /></Link></Button>
          </div>
        </div>
      </Section>

      {/* POPULAR PROGRAMS */}
      <Section tone="tint">
        <SectionHeading eyebrow="Popular programs" title="Courses kids love" />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((c) => <StaggerItem key={c.id}><CourseCard course={{ ...c, price: Number(c.price) }} /></StaggerItem>)}
        </Stagger>
      </Section>

      {/* BEST SELLERS */}
      <Section>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading align="left" eyebrow="Best selling products" title="Kits that build big ideas" className="mb-0" />
          <Button asChild variant="outline"><Link to="/shop">Visit the shop <ArrowRight /></Link></Button>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]">
          {featured.map((p) => (
            <div key={p.id} className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-[23.5%]">
              <ProductCard product={{ ...p, price: Number(p.price), mrp: Number(p.mrp), rating: Number(p.rating) }} />
            </div>
          ))}
        </div>
      </Section>

      {/* WHY CHOOSE */}
      <Section tone="white">
        <SectionHeading eyebrow="Why choose LearningBIX?" title="Built by educators, loved by kids" />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((w, i) => (
            <StaggerItem key={w.title}>
              <div className="h-full rounded-3xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <IconBadge tone={TONES[i % 4]}><BlocksIcon /></IconBadge>
                <h3 className="mt-4 text-lg font-bold">{w.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* GALLERY */}
      <Section>
        <SectionHeading eyebrow="Student project gallery" title="Made by young innovators" />
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", cat === c ? "bg-primary text-primary-foreground" : "bg-secondary hover:text-primary")}>{c}</button>
          ))}
        </div>
        <motion.div layout className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {GALLERY.filter((g) => cat === "All" || g.category === cat).map((g) => (
            <motion.figure layout key={g.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative aspect-square overflow-hidden rounded-3xl">
              <img src={g.image} alt={g.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy/85 via-navy/10 to-transparent p-4 text-navy-foreground opacity-0 transition group-hover:opacity-100">
                <span className="text-xs font-semibold uppercase text-sun">{g.category}</span>
                <span className="font-bold">{g.title}</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </Section>

      {/* TESTIMONIALS */}
      <Section tone="tint">
        <SectionHeading eyebrow="Testimonials" title="What families and schools say" />
        <Testimonials />
      </Section>

      {/* PARTNERS */}
      <Section>
        <SectionHeading eyebrow="Partner schools" title="Trusted by schools across India" />
        <PartnerGrid />
      </Section>

      <FinalCta />
    </>
  );
}
