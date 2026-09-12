// Supabase Edge Function: send-booking-confirmation
//
// Called DIRECTLY from the booking form (book.tsx) right after a booking is
// successfully inserted. Sends a confirmation email to the customer via
// Resend. Supabase verifies the caller's JWT automatically before this code
// runs (the client SDK attaches it for you), so no extra shared secret is
// needed here.
//
// Required secret (set with `supabase secrets set`):
//   RESEND_API_KEY   - your Resend API key
//
// Optional secret:
//   FROM_EMAIL       - verified sender address (defaults to Resend's shared
//                       test address, see SETUP.md)

// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Willow & Stone Studio <onboarding@resend.dev>";

type BookingRecord = {
  name: string;
  email: string;
  phone: string;
  service: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM
  notes: string | null;
};

function formatDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const [hStr, mStr] = value.split(":");
  const h = Number(hStr);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr} ${suffix}`;
}

function buildEmailHtml(booking: BookingRecord) {
  const rows: Array<[string, string]> = [
    ["Service", booking.service],
    ["Date", formatDate(booking.appointment_date)],
    ["Time", formatTime(booking.appointment_time)],
    ["Phone", booking.phone],
  ];
  if (booking.notes) rows.push(["Notes", booking.notes]);

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#6b6b6b;font-size:14px;">${label}</td>
          <td style="padding:8px 0;font-size:14px;font-weight:600;">${value}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1a1a1a;">
      <h1 style="font-size:22px;font-weight:600;margin-bottom:8px;">You're booked, ${booking.name.split(" ")[0]}</h1>
      <p style="color:#6b6b6b;font-size:14px;margin-bottom:24px;">
        Thanks for booking with Willow &amp; Stone Studio. Here are your appointment details:
      </p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;">
        ${rowsHtml}
      </table>
      <p style="color:#6b6b6b;font-size:13px;margin-top:24px;">
        Need to change or cancel? Just reply to this email.
      </p>
    </div>
  `;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // Browsers send a preflight OPTIONS request before the real POST —
  // respond with the allowed headers/methods so it can proceed.
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return new Response("Server misconfigured", { status: 500, headers: corsHeaders });
  }

  let booking: BookingRecord;
  try {
    booking = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }

  if (!booking?.email || !booking?.name) {
    return new Response("Missing booking fields", { status: 400, headers: corsHeaders });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [booking.email],
        subject: "Your appointment is confirmed — Willow & Stone Studio",
        html: buildEmailHtml(booking),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", res.status, body);
      return new Response("Email send failed", { status: 502, headers: corsHeaders });
    }

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("Unexpected error sending email:", err);
    return new Response("Unexpected error", { status: 500, headers: corsHeaders });
  }
});