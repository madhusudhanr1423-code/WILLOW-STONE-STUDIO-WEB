import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Award, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-studio.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Willow & Stone Studio" },
      {
        name: "description",
        content:
          "Learn about Willow & Stone Studio, our approach to massage therapy, and the practitioner behind every session.",
      },
      { property: "og:title", content: "About Us — Willow & Stone Studio" },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Leaf,
    title: "Unhurried by design",
    body: "Every slot has room built in either side, so no session ever feels rushed.",
  },
  {
    icon: Award,
    title: "Clinically trained",
    body: "Ten years of continuing education in therapeutic and remedial massage techniques.",
  },
  {
    icon: HeartHandshake,
    title: "Client-led plans",
    body: "Your consultation shapes the plan — we adjust as your needs change over time.",
  },
];

function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/20 via-background to-background" />
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
              Our Philosophy
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              A studio built around one client at a time
            </h1>
            <p className="mt-4 max-w-prose text-base text-muted-foreground sm:text-lg">
              Willow &amp; Stone Studio started with a simple idea: appointments shouldn't feel
              like a conveyor belt. After years of practising in larger clinics, our founder set
              out to build a space where every consultation, treatment and follow-up gets the time
              it actually needs.
            </p>
            <p className="mt-4 max-w-prose text-base text-muted-foreground sm:text-lg">
              Today, the studio runs on the same principle — a small number of appointments each
              day, a calm room to work in, and a plan that's shaped around you rather than a fixed
              menu of treatments.
            </p>
            <Button asChild size="lg" className="mt-8 w-full rounded-xl sm:w-auto">
              <Link to="/book">Reserve Your Session</Link>
            </Button>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-6 sm:gap-6">
  <div>
    <p className="text-3xl font-semibold text-primary">10+</p>
    <p className="mt-1 text-sm text-muted-foreground">
      Years Experience
    </p>
  </div>

  <div>
    <p className="text-3xl font-semibold text-primary">800+</p>
    <p className="mt-1 text-sm text-muted-foreground">
      Treatments
    </p>
  </div>

  <div>
    <p className="text-3xl font-semibold text-primary">100%</p>
    <p className="mt-1 text-sm text-muted-foreground">
      Personal Care
    </p>
  </div>
</div>
          </div>

         <div className="group relative overflow-hidden rounded-[32px] shadow-[var(--shadow-lift)]">
            <img
              src={heroImage}
              alt="Sunlit sage-green treatment room at Willow & Stone Studio"
              width={1600}
              height={1100}
              className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-80 lg:h-[30rem]"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-20 lg:py-28">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">Our Principles</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
  Every treatment is guided by a few simple principles that help create
  a calm, personalised experience from beginning to end.
</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <Card key={v.title} className="group rounded-2xl border-border/70 shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                <CardContent className="p-8">
                  <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-500 group-hover:rotate-6">
                    <v.icon className="size-5 transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-2">
          <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-background to-secondary/30 shadow-[var(--shadow-soft)]">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold">Certified &amp; insured</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Fully licensed massage therapy practice, carrying professional liability insurance
                and following all local health and safety guidelines.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-background to-secondary/30 shadow-[var(--shadow-soft)]">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold">A small, focused schedule</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We deliberately keep the daily schedule light so every appointment gets full
                attention — no back-to-back overbooking.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
