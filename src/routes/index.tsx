import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, HeartHandshake, Leaf, Clock, ShieldCheck, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@/assets/hero-studio.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Willow & Stone Studio — Calm, Personal Massage Therapy" },
      {
        name: "description",
        content:
          "Consultations, treatments and follow-ups in a calm studio setting. Book your appointment online in under a minute.",
      },
      { property: "og:title", content: "Willow & Stone Studio — Calm, Personal Massage Therapy" },
      {
        property: "og:description",
        content: "Consultations, treatments and follow-ups. Book your appointment online.",
      },
    ],
  }),
  component: Index,
});

const services = [
  {
    icon: HeartHandshake,
    title: "Consultation",
    body: "A relaxed first session to understand your goals and map out a plan that fits your life.",
  },
  {
    icon: Leaf,
    title: "Checkup",
    body: "A thorough wellness review covering movement, rest and everyday habits.",
  },
  {
    icon: Clock,
    title: "Follow-up",
    body: "A focused catch-up to track progress and adjust your plan as things change.",
  },
];

const whyUs = [
  {
    icon: ShieldCheck,
    title: "Licensed practitioners",
    body: "Every session is led by a certified therapist with years of hands-on clinical experience.",
  },
  {
    icon: Users,
    title: "One-on-one care",
    body: "No rushed slots — each appointment is booked with room to talk through what you actually need.",
  },
  {
    icon: Sparkles,
    title: "Calm, considered space",
    body: "A quiet studio designed to help you switch off the moment you walk in.",
  },
];

const testimonials = [
  {
    initials: "JM",
    name: "Jordan M.",
    quote:
      "Booking took two minutes and the reminder email meant I never had to think about it again. The session itself was even better.",
  },
  {
    initials: "AK",
    name: "Aisha K.",
    quote:
      "I've been to a lot of studios and this is the first one where I actually felt listened to during the consultation.",
  },
  {
    initials: "RT",
    name: "Ryan T.",
    quote:
      "Follow-ups are so easy to schedule now. I just pick a slot online and get on with my week.",
  },
];

const faqs = [
  {
    q: "Do I need to book a consultation before my first treatment?",
    a: "Yes — every new client starts with a short consultation so we can understand your goals and any areas to be mindful of before the first treatment session.",
  },
  {
    q: "What should I wear or bring?",
    a: "Comfortable clothing is fine. We provide everything else you need for your session, including a private changing area.",
  },
  {
    q: "Can I reschedule or cancel a booking?",
    a: "Yes, just email or call us at least 24 hours ahead and we'll happily move your slot to another time that works.",
  },
  {
    q: "How far in advance can I book?",
    a: "Our online calendar is open for the next few weeks at a time, Monday to Friday, 9:00 AM to 5:00 PM.",
  },
];

function Index() {
  return (
    <div>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
              <Leaf className="size-3.5" /> Wellness, unhurried
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl">
              Care that gives you room to breathe
            </h1>
            <p className="mt-4 max-w-prose text-base text-muted-foreground sm:text-lg">
              Willow &amp; Stone Studio offers thoughtful consultations, treatments and follow-ups
              in a quiet, welcoming space. Pick a time that suits you — we handle the rest.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full rounded-xl shadow-[var(--shadow-soft)] hover-lift sm:w-auto">
                <Link to="/book">
                  <CalendarCheck className="size-5" /> Book an appointment
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full rounded-xl sm:w-auto">
                <a href="#services">Explore services</a>
              </Button>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-3xl shadow-[var(--shadow-lift)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
            <img
              src={heroImage}
              alt="Sunlit sage-green treatment room at Willow & Stone Studio"
              width={1600}
              height={1100}
              className="h-56 w-full object-cover sm:h-80 lg:h-[26rem]"
            />
          </div>
        </div>
      </section>

      <section id="services" className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold sm:text-4xl">What we offer</h2>
              <p className="mt-3 text-muted-foreground">
                Three simple ways to work together, each with a practitioner who knows your
                history.
              </p>
            </div>
            <Link
              to="/services"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View full service details →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.title}
                className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)] hover-lift"
              >
                <CardContent className="p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <service.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">Why clients come back</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {whyUs.map((item) => (
            <div key={item.title}>
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">What clients say</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)] hover-lift">
                <CardContent className="p-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{t.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center shadow-[var(--shadow-lift)] sm:px-12">
          <h2 className="text-3xl font-semibold text-primary-foreground sm:text-4xl">
            Ready when you are
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Appointments run weekdays from 9:00 AM to 5:00 PM. Choose your slot and we'll confirm by
            email.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 w-full rounded-xl sm:w-auto">
            <Link to="/book">Book your visit</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
