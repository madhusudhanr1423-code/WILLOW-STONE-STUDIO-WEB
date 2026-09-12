import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Willow & Stone Studio" },
      {
        name: "description",
        content:
          "Get in touch with Willow & Stone Studio — address, phone, email and opening hours.",
      },
      { property: "og:title", content: "Contact — Willow & Stone Studio" },
    ],
  }),
  component: ContactPage,
});

const details = [
  {
    icon: MapPin,
    label: "Studio address",
    value: "123 Example Street, Suite 4",
  },
  {
    icon: Clock,
    label: "Opening hours",
    value: "Monday – Friday, 9:00 AM – 5:00 PM",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@willowandstone.example",
    href: "mailto:hello@willowandstone.example",
  },
];

function ContactPage() {
  return (
    <div>
      <section className="relative overflow-hidden mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/20 via-background to-background" />
        <div className="rounded-2xl border border-border/70 bg-secondary/30 px-5 py-4 text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
          <strong className="text-foreground">Portfolio demo:</strong> Willow &amp; Stone Studio
          is a fictional business built to showcase this booking app. The contact details below
          are placeholders, not a real studio.
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
            Get in touch
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
            We'd love to hear from you
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            The fastest way to get an appointment on the calendar is to book online, but reach out
            directly for anything else — questions about a treatment, accessibility needs, or
            general enquiries.
          </p>
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2">
            {details.map((d) => (
              <Card key={d.label} className="group rounded-3xl border-border/70 bg-gradient-to-br from-background to-secondary/30 shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                <CardContent className="flex items-start gap-4 p-8">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-500 group-hover:rotate-6">
                    <d.icon className="size-5 transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{d.label}</p>
                    {d.href ? (
                      <a href={d.href} className="mt-1 block text-lg font-semibold hover:text-primary">
                        {d.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-lg font-semibold">{d.value}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto h-px max-w-6xl bg-border/50" />

      <section className="mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-24">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Reserve Your Session</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Skip the back-and-forth — pick a service and a time slot that suits you, and we'll
          confirm by email.
        </p>
        <Button asChild size="lg" className="mt-6 w-full rounded-xl sm:w-auto">
          <Link to="/book">
            <CalendarCheck className="size-4" /> Book an appointment
          </Link>
        </Button>
      </section>
    </div>
  );
}
