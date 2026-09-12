import { createFileRoute, Link } from "@tanstack/react-router";
import { DoorOpen, Sofa, Waves, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import galleryImage from "@/assets/gallery.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Willow & Stone Studio" },
      {
        name: "description",
        content: "A look inside Willow & Stone Studio — the reception, treatment rooms and relaxation lounge.",
      },
      { property: "og:title", content: "Gallery — Willow & Stone Studio" },
    ],
  }),
  component: GalleryPage,
});

const spaces = [
  {
    icon: DoorOpen,
    title: "Reception",
    body: "A warm welcome the moment you walk in, with herbal tea while you wait.",
  },
  {
    icon: Waves,
    title: "Treatment room",
    body: "Sunlit and quiet, with heated tables and soft ambient sound.",
  },
  {
    icon: Sofa,
    title: "Relaxation lounge",
    body: "A place to sit for a few minutes after your session before heading back out.",
  },
  {
    icon: Wind,
    title: "Private changing area",
    body: "Everything you need on hand, so you can settle in without rushing.",
  },
];

function GalleryPage() {
  return (
    <div>
      <section className="relative overflow-hidden mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/20 via-background to-background" />
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
            Gallery
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
            A look inside the studio
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Every room is designed around the same idea as our appointments: calm, unhurried, and
            personal.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6">
        <div className="group relative overflow-hidden rounded-[32px] shadow-[var(--shadow-lift)]">
          <img
             src="/gallery.jpg"
             alt="Relaxing massage therapy at Willow & Stone Studio"
            width={1600}
            height={1100}
            className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[550px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

<div className="absolute bottom-8 left-8 text-white">
  <p className="text-sm uppercase tracking-[0.25em] opacity-80">
    Willow & Stone Studio
  </p>

  <h2 className="mt-2 text-3xl font-semibold">
    A sanctuary for rest & recovery
  </h2>
</div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 lg:py-28 sm:px-6 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {spaces.map((space) => (
              <div key={space.title} className="rounded-2xl border border-border/70 bg-background p-6 shadow-[var(--shadow-soft)] group transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)] bg-gradient-to-br from-background to-secondary/30">
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-500 group-hover:rotate-6">
                  <space.icon className="size-5 transition-transform duration-500 group-hover:scale-110" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{space.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{space.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto h-px max-w-6xl bg-border/50" />

      <section className="mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-20 lg:py-24">
        <h2 className="text-2xl font-semibold sm:text-3xl">See it in person</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          The best way to experience the space is to book a visit.
        </p>
        <Button asChild size="lg" className="mt-6 w-full rounded-xl sm:w-auto">
          <Link to="/book">Reserve Your Visit</Link>
        </Button>
      </section>
    </div>
  );
}
