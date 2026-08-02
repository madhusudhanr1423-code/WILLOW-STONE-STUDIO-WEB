import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, CalendarCheck, CalendarX } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SERVICES,
  TIME_SLOTS,
  formatDate,
  formatTime,
  todayISO,
  type Service,
} from "@/lib/bookings";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — Willow & Stone Studio" },
      {
        name: "description",
        content:
          "Choose a service, date and time slot between 9 AM and 5 PM and book your Willow & Stone Studio appointment online.",
      },
      { property: "og:title", content: "Book an Appointment — Willow & Stone Studio" },
      {
        property: "og:description",
        content: "Choose a service, date and time and book your visit online.",
      },
    ],
  }),
  component: BookPage,
});

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid phone number")
    .max(30)
    .regex(/^[0-9+()\-.\s]+$/, "Phone can only contain digits and + ( ) - ."),
  service: z.enum(SERVICES, { errorMap: () => ({ message: "Select a service" }) }),
  appointment_date: z
    .string()
    .min(1, "Pick a date")
    .refine((v) => v >= todayISO(), "Please pick today or a future date"),
  appointment_time: z.string().min(1, "Pick a time"),
  notes: z.string().trim().max(1000, "Notes must be under 1000 characters").optional(),
});

type FormValues = z.infer<typeof bookingSchema>;
type Errors = Partial<Record<keyof FormValues, string>>;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  service: "" as Service | "",
  appointment_date: "",
  appointment_time: "",
  notes: "",
};

function BookPage() {
  const { session, profile } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [confirmed, setConfirmed] = useState<FormValues | null>(null);

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || profile.full_name || "",
        email: prev.email || profile.email || "",
      }));
    }
  }, [profile]);

  const { data: blockedSlots } = useQuery({
    queryKey: ["blocked-slots", form.appointment_date],
    enabled: !!form.appointment_date,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blocked_slots")
        .select("*")
        .eq("blocked_date", form.appointment_date);
      if (error) throw error;
      return data;
    },
  });

  const { data: takenSlots, refetch: refetchTakenSlots } = useQuery({
    queryKey: ["taken-slots", form.appointment_date],
    enabled: !!form.appointment_date,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("appointment_time")
        .eq("appointment_date", form.appointment_date)
        .neq("status", "cancelled");
      if (error) throw error;
      return data.map((b) => b.appointment_time);
    },
  });

  const wholeDayBlocked = blockedSlots?.some((s) => s.blocked_time === null) ?? false;
  const blockedTimes = new Set([
    ...(blockedSlots?.map((s) => s.blocked_time).filter(Boolean) ?? []),
    ...(takenSlots ?? []),
  ]);
  const availableSlots = TIME_SLOTS.filter((slot) => !blockedTimes.has(slot));

  useEffect(() => {
    if (form.appointment_time && (wholeDayBlocked || blockedTimes.has(form.appointment_time))) {
      setForm((prev) => ({ ...prev, appointment_time: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.appointment_date, blockedSlots, takenSlots]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase.from("bookings").insert({
        name: values.name,
        email: values.email,
        phone: values.phone,
        service: values.service,
        appointment_date: values.appointment_date,
        appointment_time: values.appointment_time,
        notes: values.notes?.length ? values.notes : null,
        user_id: session?.user.id ?? null,
      });
      if (error) throw error;
      return values;
    },
    onSuccess: (values) => {
      setConfirmed(values);
      setForm(emptyForm);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ["taken-slots"] });
    },
    onError: (error: { code?: string }) => {
      if (error?.code === "23505") {
        toast.error("That time slot was just booked by someone else — please pick another.");
        void refetchTakenSlots();
      } else {
        toast.error("We couldn't save your booking. Please try again.");
      }
    },
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  }

  if (confirmed) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
        <Card className="rounded-3xl border-border/70 shadow-[var(--shadow-lift)]">
          <CardContent className="p-6 text-center sm:p-10">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <CheckCircle2 className="size-7" />
            </span>
            <h1 className="mt-5 text-3xl font-semibold">You're booked</h1>
            <p className="mt-2 text-muted-foreground">
              Thanks {confirmed.name.split(" ")[0]} — we've sent the details to {confirmed.email}.
            </p>

            <dl className="mt-8 grid gap-3 rounded-2xl bg-secondary/60 p-5 text-left text-sm">
              {[
                ["Service", confirmed.service],
                ["Date", formatDate(confirmed.appointment_date)],
                ["Time", formatTime(confirmed.appointment_time)],
                ["Phone", confirmed.phone],
                ...(confirmed.notes ? [["Notes", confirmed.notes] as const] : []),
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4"
                >
                  <dt className="font-medium text-muted-foreground">{label}</dt>
                  <dd className="min-w-0 break-words font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                className="w-full rounded-xl sm:w-auto"
                onClick={() => setConfirmed(null)}
              >
                Book another appointment
              </Button>
              <Button asChild className="w-full rounded-xl sm:w-auto">
                <Link to="/">Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold sm:text-4xl">Book an appointment</h1>
        <p className="mt-3 text-muted-foreground">
          Weekday slots run from 9:00 AM to 5:00 PM. It takes about a minute.
        </p>
      </div>

      <Card className="mt-8 rounded-3xl border-border/70 shadow-[var(--shadow-soft)] hover-lift">
        <CardContent className="p-5 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.name} htmlFor="name">
                <Input
                  id="name"
                  value={form.name}
                  maxLength={100}
                  autoComplete="name"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl"
                />
              </Field>
              <Field label="Email" error={errors.email} htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  maxLength={255}
                  autoComplete="email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-xl"
                />
              </Field>
              <Field label="Phone" error={errors.phone} htmlFor="phone">
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  maxLength={30}
                  autoComplete="tel"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-xl"
                />
              </Field>
              <Field label="Service" error={errors.service} htmlFor="service">
                <Select
                  value={form.service}
                  onValueChange={(value) => setForm({ ...form, service: value as Service })}
                >
                  <SelectTrigger id="service" className="w-full rounded-xl">
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date" error={errors.appointment_date} htmlFor="date">
                <Input
                  id="date"
                  type="date"
                  min={todayISO()}
                  value={form.appointment_date}
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                  className="w-full rounded-xl"
                />
              </Field>
              <Field label="Time" error={errors.appointment_time} htmlFor="time">
                {wholeDayBlocked ? (
                  <p className="flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/50 px-3 py-2.5 text-sm text-muted-foreground">
                    <CalendarX className="size-4 shrink-0" /> This date isn't available — please
                    choose another day.
                  </p>
                ) : (
                  <Select
                    value={form.appointment_time}
                    onValueChange={(value) => setForm({ ...form, appointment_time: value })}
                  >
                    <SelectTrigger id="time" className="w-full rounded-xl">
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {availableSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {formatTime(slot)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            </div>

            <Field label="Notes (optional)" error={errors.notes} htmlFor="notes">
              <Textarea
                id="notes"
                rows={4}
                maxLength={1000}
                value={form.notes}
                placeholder="Anything we should know before your visit?"
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="resize-y rounded-xl"
              />
            </Field>

            <Button
              type="submit"
              size="lg"
              disabled={mutation.isPending}
              className="w-full rounded-xl sm:w-auto sm:justify-self-start"
            >
              <CalendarCheck className="size-5" />
              {mutation.isPending ? "Booking…" : "Confirm booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}