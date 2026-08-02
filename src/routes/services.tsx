import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HeartHandshake, Leaf, Clock, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, type Service } from "@/lib/bookings";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Willow & Stone Studio" },
      {
        name: "description",
        content:
          "See what's included in each appointment type at Willow & Stone Studio — consultations, checkups and follow-ups.",
      },
      { property: "og:title", content: "Services & Pricing — Willow & Stone Studio" },
    ],
  }),
  component: ServicesPage,
});

const iconByService: Record<Service, typeof HeartHandshake> = {
  Consultation: HeartHandshake,
  Checkup: Leaf,
  "Follow-up": Clock,
};

function ServicesPage() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
            Services
          </span>
          <h1 className="mt-5 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
            Three ways to work together
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Every plan starts with a consultation, then flows into whichever mix of checkups and
            follow-ups suits how often you'd like to come in. Pricing below is managed by the
            studio and kept up to date here automatically.
          </p>
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          {isLoading && <p className="text-muted-foreground">Loading services…</p>}
          <div className="grid gap-6 lg:grid-cols-3">
            {services?.map((service) => {
              const Icon = iconByService[service.name];
              return (
                <Card
                  key={service.id}
                  className="flex flex-col rounded-2xl border-border/70 shadow-[var(--shadow-soft)] hover-lift"
                >
                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <Badge variant="secondary" className="rounded-full">
                        {service.tagline}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{service.name}</h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-semibold">
                        {formatPrice(service.price_cents)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {service.duration_minutes} min
                      </span>
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <Button asChild className="mt-6 w-full rounded-xl">
                      <Link to="/book">
                        <CalendarCheck className="size-4" /> Book {service.name.toLowerCase()}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <h2 className="text-2xl font-semibold sm:text-3xl">Not sure which one you need?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Start with a consultation — your practitioner will recommend a follow-up schedule based
          on what comes up during your first session.
        </p>
        <Button asChild size="lg" className="mt-6 w-full rounded-xl sm:w-auto">
          <Link to="/book">Book a consultation</Link>
        </Button>
      </section>
    </div>
  );
}
