import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime, type Booking, type BookingStatus } from "@/lib/bookings";

export const Route = createFileRoute("/my-bookings")({
  head: () => ({
    meta: [{ title: "My Bookings — Willow & Stone Studio" }, { name: "robots", content: "noindex" }],
  }),
  component: MyBookingsPage,
});

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-warning/20 text-warning-foreground border-warning/40",
  confirmed: "bg-success/15 text-success border-success/40",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

function MyBookingsPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

 useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;
    supabase.rpc("claim_guest_bookings").then(() => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    });
  }, [session?.user.id, queryClient]);
  
  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings", session?.user.id],
    enabled: !!session,
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", session!.user.id)
        .order("appointment_date", { ascending: true });
      if (error) throw error;
      return data as Booking[];
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Booking cancelled.");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: () => toast.error("Couldn't cancel that booking — please try again."),
  });

  if (loading || !session) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-6xl items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">My bookings</h1>
          <p className="mt-2 text-muted-foreground">Everything you've booked with us, in one place.</p>
        </div>
        <Button asChild className="rounded-xl">
          <Link to="/book">
            <CalendarCheck className="size-4" /> Book another visit
          </Link>
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading your bookings…</p>}

        {!isLoading && data?.length === 0 && (
          <Card className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)]">
            <CardContent className="p-8 text-center text-muted-foreground">
              You don't have any bookings yet.{" "}
              <Link to="/book" className="font-medium text-primary hover:underline">
                Book your first appointment →
              </Link>
            </CardContent>
          </Card>
        )}

        {data?.map((booking) => (
          <Card key={booking.id} className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)]">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{booking.service}</p>
                  <Badge variant="outline" className={statusStyles[booking.status]}>
                    {booking.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(booking.appointment_date)} · {formatTime(booking.appointment_time)}
                </p>
              </div>
              {booking.status !== "cancelled" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate(booking.id)}
                >
                  <X className="size-4" /> Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
