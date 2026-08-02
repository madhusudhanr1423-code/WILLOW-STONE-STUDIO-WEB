export const SERVICES = ["Consultation", "Checkup", "Follow-up"] as const;
export type Service = (typeof SERVICES)[number];

export const STATUSES = ["pending", "confirmed", "cancelled"] as const;
export type BookingStatus = (typeof STATUSES)[number];

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: Service;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  user_id: string | null;
};

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

/** 9:00 AM to 5:00 PM in 30-minute intervals. */
export const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const minutes = 9 * 60 + i * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

export function formatTime(value: string) {
  const [hStr, mStr] = value.split(":");
  const h = Number(hStr);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr} ${suffix}`;
}

export function formatDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}