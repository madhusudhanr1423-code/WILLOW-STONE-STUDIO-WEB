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
      <section className="relative overflow-hidden mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/20 via-background to-background" />
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
            Services
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
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
       {!isLoading && services?.length === 0 && (
  <p className="text-center text-muted-foreground">
    Services will be available soon.
  </p>
)}
          <div className="grid gap-6 lg:grid-cols-3">
            {services?.map((service) => {
              const Icon = iconByService[service.name];
              return (
                <Card
                  key={service.id}
                  className="group flex flex-col rounded-3xl border-border/70 bg-gradient-to-br from-background to-secondary/30 shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]"
                >
                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-500 group-hover:rotate-6">
                        <Icon className="size-5 transition-transform duration-500 group-hover:scale-110" />
                      </span>
                      <Badge variant="secondary" className="rounded-full border border-border/60 px-3 py-1">
                        {service.tagline}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{service.name}</h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-semibold tracking-tight">
                        {formatPrice(service.price_cents)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {service.duration_minutes} min
                      </span>
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                      <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                        <div>✓ Personal consultation</div>
                        <div>✓ Tailored treatment plan</div>
                        <div>✓ Professional after-care advice</div>
                      </div>
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

      
      <div className="mx-auto h-px max-w-6xl bg-border/50" />

      <section className="mx-auto w-full max-w-4xl rounded-3xl bg-secondary/20 px-4 py-20 text-center sm:px-8 lg:py-24">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Not sure which one you need?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Start with a consultation — your practitioner will recommend a follow-up schedule based
          on what comes up during your first session.
        </p>
        <Button asChild size="lg" className="mt-6 w-full rounded-xl sm:w-auto">
          <Link to="/book">Reserve Session</Link>
        </Button>
      </section>
    </div>
  );
}
