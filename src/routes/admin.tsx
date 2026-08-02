import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Filter, RotateCcw, ShieldAlert, Trash2, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STATUSES,
  TIME_SLOTS,
  formatDate,
  formatTime,
  formatPrice,
  type Booking,
  type BookingStatus,
} from "@/lib/bookings";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Bookings Dashboard — Willow & Stone Studio" },
      {
        name: "description",
        content:
          "Review upcoming Willow & Stone Studio appointments, filter by status or date, and update booking status.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Bookings Dashboard — Willow & Stone Studio" },
      {
        property: "og:description",
        content: "Review and manage upcoming studio appointments.",
      },
    ],
  }),
  component: AdminPage,
});

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-warning/20 text-warning-foreground border-warning/40",
  confirmed: "bg-success/15 text-success border-success/40",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

function AdminPage() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/login" });
    }
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-6xl items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (role && role !== "owner") {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center px-4 text-center">
        <ShieldAlert className="size-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">This page is for studio owners</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account doesn't have owner access. Head to your bookings instead.
        </p>
        <Link to="/my-bookings" className="mt-6 text-sm font-medium text-primary hover:underline">
          Go to my bookings →
        </Link>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [tab, setTab] = useState<"bookings" | "services" | "availability">("bookings");

  const { data: allBookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  const stats = useMemo(() => {
    const list = allBookings ?? [];
    const todayISO = new Date().toISOString().slice(0, 10);
    const weekAhead = new Date();
    weekAhead.setDate(weekAhead.getDate() + 7);
    const weekAheadISO = weekAhead.toISOString().slice(0, 10);

    return {
      upcoming: list.filter((b) => b.appointment_date >= todayISO && b.status !== "cancelled")
        .length,
      thisWeek: list.filter(
        (b) =>
          b.appointment_date >= todayISO &&
          b.appointment_date <= weekAheadISO &&
          b.status !== "cancelled",
      ).length,
      pending: list.filter((b) => b.status === "pending").length,
      confirmed: list.filter((b) => b.status === "confirmed").length,
    };
  }, [allBookings]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="grid gap-2">
        <h1 className="text-3xl font-semibold sm:text-4xl">Studio dashboard</h1>
        <p className="text-muted-foreground">
          Bookings, pricing and availability, all in one place.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Upcoming" value={stats.upcoming} />
        <StatCard label="This week" value={stats.thisWeek} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Confirmed" value={stats.confirmed} />
      </div>

      <div className="mt-8 flex gap-2 rounded-xl bg-secondary p-1 sm:inline-flex">
        {(
          [
            ["bookings", "Bookings"],
            ["services", "Services & pricing"],
            ["availability", "Availability"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:flex-initial ${
              tab === key ? "bg-background shadow-[var(--shadow-soft)] hover-lift" : "text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "bookings" && <BookingsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "availability" && <AvailabilityTab />}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)] hover-lift">
      <CardContent className="p-4">
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function BookingsTab() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["bookings"],
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking status updated");
    },
    onError: () => toast.error("Couldn't update that booking."),
  });

  const bookings = useMemo(() => {
    return (data ?? []).filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (dateFilter && b.appointment_date !== dateFilter) return false;
      return true;
    });
  }, [data, statusFilter, dateFilter]);

  const hasFilters = statusFilter !== "all" || dateFilter !== "";

  return (
    <div>
      <Card className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)] hover-lift">
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,14rem)_minmax(0,14rem)_auto] lg:items-end">
            <div className="grid min-w-0 gap-2">
              <Label htmlFor="status-filter" className="flex items-center gap-2 text-sm">
                <Filter className="size-4 shrink-0" /> Status
              </Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as BookingStatus | "all")}
              >
                <SelectTrigger id="status-filter" className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid min-w-0 gap-2">
              <Label htmlFor="date-filter" className="flex items-center gap-2 text-sm">
                <CalendarDays className="size-4 shrink-0" /> Date
              </Label>
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-xl"
              />
            </div>

            <Button
              variant="outline"
              disabled={!hasFilters}
              onClick={() => {
                setStatusFilter("all");
                setDateFilter("");
              }}
              className="w-full rounded-xl sm:w-auto lg:justify-self-start"
            >
              <RotateCcw className="size-4" /> Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="mt-10 text-muted-foreground">Loading bookings…</p>
      ) : isError ? (
        <p className="mt-10 text-destructive">We couldn't load bookings. Please refresh.</p>
      ) : bookings.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          {hasFilters ? "No bookings match these filters." : "No bookings yet."}
        </p>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="mt-8 grid gap-4 lg:hidden">
            {bookings.map((booking) => (
              <Card key={booking.id} className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)] hover-lift">
                <CardContent className="grid gap-4 p-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg font-semibold">{booking.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{booking.service}</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 capitalize ${statusStyles[booking.status]}`}>
                      {booking.status}
                    </Badge>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <Detail label="Date" value={formatDate(booking.appointment_date)} />
                    <Detail label="Time" value={formatTime(booking.appointment_time)} />
                    <Detail label="Phone" value={booking.phone} />
                    <Detail label="Email" value={booking.email} />
                  </dl>
                  <StatusSelect
                    value={booking.status}
                    disabled={updateStatus.isPending}
                    onChange={(status) => updateStatus.mutate({ id: booking.id, status })}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop: table, scrollable inside its own container */}
          <Card className="mt-8 hidden overflow-hidden rounded-2xl border-border/70 shadow-[var(--shadow-soft)] lg:block">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
                <thead className="bg-secondary/60">
                  <tr>
                    {["Name", "Service", "Date", "Time", "Phone", "Status"].map((heading) => (
                      <th key={heading} className="px-4 py-3 font-semibold whitespace-nowrap">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-border/70 align-middle">
                      <td className="max-w-[14rem] px-4 py-3">
                        <p className="truncate font-medium">{booking.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{booking.email}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.service}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatDate(booking.appointment_date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatTime(booking.appointment_time)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.phone}</td>
                      <td className="px-4 py-3">
                        <StatusSelect
                          value={booking.status}
                          disabled={updateStatus.isPending}
                          onChange={(status) => updateStatus.mutate({ id: booking.id, status })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  );
}

function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: BookingStatus;
  disabled: boolean;
  onChange: (status: BookingStatus) => void;
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as BookingStatus)}>
      <SelectTrigger
        disabled={disabled}
        className="w-full rounded-xl capitalize lg:w-[9.5rem]"
        aria-label="Booking status"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((status) => (
          <SelectItem key={status} value={status} className="capitalize">
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
type ServiceRow = {
  id: string;
  name: "Consultation" | "Checkup" | "Follow-up";
  duration_minutes: number;
  price_cents: number;
  tagline: string;
  description: string;
  sort_order: number;
};

function ServicesTab() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<ServiceRow>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async (): Promise<ServiceRow[]> => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ServiceRow[];
    },
  });

  const updateService = useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<ServiceRow> }) => {
      const { error } = await supabase.from("services").update(changes).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service updated");
      setEditingId(null);
    },
    onError: () => toast.error("Couldn't save that change."),
  });

  function startEdit(service: ServiceRow) {
    setEditingId(service.id);
    setDraft({
      duration_minutes: service.duration_minutes,
      price_cents: service.price_cents,
      tagline: service.tagline,
      description: service.description,
    });
  }

  function saveEdit(id: string) {
    updateService.mutate({ id, changes: draft });
  }

  if (isLoading) return <p className="text-muted-foreground">Loading services…</p>;

  return (
    <div className="grid gap-4">
      {data?.map((service) => {
        const isEditing = editingId === service.id;
        return (
          <Card key={service.id} className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)] hover-lift">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{service.name}</p>
                  {!isEditing && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(service.price_cents)} · {service.duration_minutes} min ·{" "}
                      {service.tagline}
                    </p>
                  )}
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" className="rounded-lg" onClick={() => startEdit(service)}>
                    <Pencil className="size-4" /> Edit
                  </Button>
                )}
              </div>

              {isEditing && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`price-${service.id}`}>Price (USD)</Label>
                    <Input
                      id={`price-${service.id}`}
                      type="number"
                      min={0}
                      step="0.01"
                      value={(draft.price_cents ?? service.price_cents) / 100}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, price_cents: Math.round(Number(e.target.value) * 100) }))
                      }
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`duration-${service.id}`}>Duration (minutes)</Label>
                    <Input
                      id={`duration-${service.id}`}
                      type="number"
                      min={5}
                      step="5"
                      value={draft.duration_minutes ?? service.duration_minutes}
                      onChange={(e) => setDraft((d) => ({ ...d, duration_minutes: Number(e.target.value) }))}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`tagline-${service.id}`}>Badge text</Label>
                    <Input
                      id={`tagline-${service.id}`}
                      value={draft.tagline ?? service.tagline}
                      onChange={(e) => setDraft((d) => ({ ...d, tagline: e.target.value }))}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={`desc-${service.id}`}>Description</Label>
                    <Textarea
                      id={`desc-${service.id}`}
                      value={draft.description ?? service.description}
                      onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                      className="mt-1.5 rounded-xl"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 sm:col-span-2">
                    <Button
                      onClick={() => saveEdit(service.id)}
                      disabled={updateService.isPending}
                      className="rounded-lg"
                    >
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingId(null)} className="rounded-lg">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      <p className="text-xs text-muted-foreground">
        Changes here update the live Services page and pricing shown to customers immediately.
      </p>
    </div>
  );
}

type BlockedSlotRow = {
  id: string;
  blocked_date: string;
  blocked_time: string | null;
  reason: string | null;
};

function AvailabilityTab() {
  const queryClient = useQueryClient();
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState<string>("all-day");
  const [newReason, setNewReason] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["blocked-slots-admin"],
    queryFn: async (): Promise<BlockedSlotRow[]> => {
      const { data, error } = await supabase
        .from("blocked_slots")
        .select("*")
        .order("blocked_date", { ascending: true });
      if (error) throw error;
      return data as BlockedSlotRow[];
    },
  });

  const addBlock = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("blocked_slots").insert({
        blocked_date: newDate,
        blocked_time: newTime === "all-day" ? null : newTime,
        reason: newReason.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked-slots-admin"] });
      toast.success("Blocked");
      setNewDate("");
      setNewTime("all-day");
      setNewReason("");
    },
    onError: () => toast.error("Couldn't save — that date/time may already be blocked."),
  });

  const removeBlock = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked-slots-admin"] });
      toast.success("Availability restored");
    },
    onError: () => toast.error("Couldn't remove that block."),
  });

  return (
    <div className="grid gap-6">
      <Card className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)] hover-lift">
        <CardContent className="p-5">
          <p className="font-medium">Block off a day or time slot</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Blocked slots disappear from the booking form immediately.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <div>
              <Label htmlFor="block-date">Date</Label>
              <Input
                id="block-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="block-time">Time</Label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger id="block-time" className="mt-1.5 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-day">Whole day</SelectItem>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {formatTime(slot)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="block-reason">Reason (optional)</Label>
              <Input
                id="block-reason"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="e.g. Holiday"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <Button
              disabled={!newDate || addBlock.isPending}
              onClick={() => addBlock.mutate()}
              className="rounded-xl"
            >
              <Plus className="size-4" /> Block
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="text-muted-foreground">Loading availability…</p>
      ) : data?.length === 0 ? (
        <p className="text-muted-foreground">No blocked dates or times — the calendar is fully open.</p>
      ) : (
        <div className="grid gap-3">
          {data?.map((block) => (
            <Card key={block.id} className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)] hover-lift">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">
                    {formatDate(block.blocked_date)}
                    {block.blocked_time ? ` · ${formatTime(block.blocked_time)}` : " · Whole day"}
                  </p>
                  {block.reason && <p className="text-sm text-muted-foreground">{block.reason}</p>}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={removeBlock.isPending}
                  onClick={() => removeBlock.mutate(block.id)}
                >
                  <Trash2 className="size-4" /> Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
