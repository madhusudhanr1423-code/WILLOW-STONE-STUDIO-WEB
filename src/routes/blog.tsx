import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Wellness Tips — Willow & Stone Studio" },
      {
        name: "description",
        content: "Short, practical wellness tips from the Willow & Stone Studio team.",
      },
      { property: "og:title", content: "Wellness Tips — Willow & Stone Studio" },
    ],
  }),
  component: BlogPage,
});

const posts = [
  {
    tag: "Recovery",
    title: "Why the day after your massage matters as much as the session itself",
    body: "Drink more water than usual, keep movement gentle, and avoid long stretches sitting still. Muscles are more responsive right after treatment — a short walk does more good than a couch session.",
  },
  {
    tag: "At home",
    title: "Three stretches to do between appointments",
    body: "A doorway chest stretch, a seated spinal twist, and a standing calf stretch — each held for 20-30 seconds — help maintain progress between visits without needing any equipment.",
  },
  {
    tag: "Habits",
    title: "The desk habit that undoes most of what a massage fixes",
    body: "Forward head posture from looking down at a phone or laptop screen re-creates the exact neck and shoulder tension most clients come in for. Raising your screen to eye level is a small change with an outsized effect.",
  },
  {
    tag: "First visit",
    title: "What to expect at your first consultation",
    body: "No need to prepare anything special — wear comfortable clothing and arrive a few minutes early. Your practitioner will ask about problem areas, activity levels, and goals before recommending a plan.",
  },
];

function BlogPage() {
  return (
    <div>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
            Wellness tips
          </span>
          <h1 className="mt-5 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
            A few things worth knowing
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Short, practical notes from our practitioners — nothing that needs a whole appointment
            to explain.
          </p>
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Card key={post.title} className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)] hover-lift">
                <CardContent className="p-6">
                  <Badge variant="secondary" className="rounded-full">
                    {post.tag}
                  </Badge>
                  <h2 className="mt-4 text-xl font-semibold leading-snug">{post.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <h2 className="text-2xl font-semibold sm:text-3xl">Have a question of your own?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Bring it up during your consultation — that first session is built around your specific
          goals.
        </p>
        <Button asChild size="lg" className="mt-6 w-full rounded-xl sm:w-auto">
          <Link to="/book">
            <CalendarCheck className="size-4" /> Book a consultation
          </Link>
        </Button>
      </section>
    </div>
  );
}
