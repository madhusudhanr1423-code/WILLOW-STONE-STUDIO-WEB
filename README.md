# Willow & Stone Studio — Appointment Booking Platform

A full-stack booking system built for a massage therapy studio, letting clients book
appointments online and letting the business manage bookings from a live dashboard.

**Live demo:** _add your deployed link here_
**Admin dashboard:** `/admin` (see note on auth below)

## The problem

Small service businesses (studios, clinics, salons, consultants) lose bookings to phone-tag
and no-shows when there's no simple way for clients to self-schedule. This project solves
that with a public booking flow backed by a real database, plus a dashboard for the business
owner to see and manage every appointment.

## What it does

- **Public site** — home, about, services (with pricing), gallery, wellness tips, and
  contact pages for a real small-business feel, not just a bare booking form
- **Booking flow** (`/book`) — clients pick a service, date and time slot, submit their
  details, and get an instant confirmation screen. Booking works as a guest — no account
  required — but logs in automatically if you're signed in
- **Accounts with two roles** — anyone can create a free account (`/login`) to see their
  own booking history at `/my-bookings` and cancel a booking themselves. One specific
  account is promoted to `owner` (see setup below), which unlocks `/admin`
- **Admin dashboard** (`/admin`, owner-only) — three tabs:
  - **Bookings** — every booking sorted by date, filter by status/date, update status
  - **Services & pricing** — edit price, duration, badge text and description for each
    service; changes reflect on the public Services page immediately
  - **Availability** — block off a whole day or a specific time slot (e.g. holidays,
    lunch breaks); blocked slots disappear from the booking form right away
  - A stats strip up top (upcoming bookings, this week, pending, confirmed)
  - Protected by real authentication + row-level security, not just a hidden URL
- Fully responsive — the admin table collapses into stacked cards on mobile instead of
  breaking into a horizontal-scroll mess

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React + [TanStack Start](https://tanstack.com/start) (file-based routing, SSR) |
| Styling | Tailwind CSS + shadcn/ui components |
| Forms & validation | Controlled inputs + [Zod](https://zod.dev) schemas |
| Data fetching | TanStack Query (mutations + queries against Supabase) |
| Backend | [Supabase](https://supabase.com) (Postgres database, row-level security policies) |
| Icons | lucide-react |

> **Note on stack:** this was originally scoped as a Next.js project. It was generated with
> an AI app builder that defaulted to TanStack Start instead — a comparable modern
> React/SSR framework, but worth knowing if you're specifically screening for Next.js
> experience.

## Database design

A single `bookings` table in Postgres, with `service` and `status` modelled as native
Postgres enums (`service_type`, `booking_status`) rather than free-text strings — this keeps
the data consistent between what the booking form can submit and what the admin dashboard
can filter on.

Row-level security policies allow anonymous users to create and read bookings (since there's
no auth layer yet — see below), matching what a real client's front desk staff would need
without requiring them to log in for a v1.

## Making your account the owner

There's no signup flow for "owner" specifically — every new signup gets a `customer` role
by default in the `user_roles` table, and one account is promoted manually. After
deploying:

1. Sign up once through `/login` using the email you want to manage the studio with.
2. In the Supabase SQL editor (or via Lovable, if that's how you manage the database),
   run:
   ```sql
   update public.user_roles
   set role = 'owner'
   where user_id = (select id from public.profiles where email = 'you@example.com');
   ```
3. Log out and back in — the header will now show "Dashboard" instead of "My bookings",
   and `/admin` will load instead of showing the "owners only" message.

## Known limitations (intentional, for a v1)

- **No payment collection.** Bookings are free-to-submit appointment requests, not paid
  transactions — a natural next step would be adding a deposit via Stripe Checkout.
- **No automated email confirmations yet** — the in-app confirmation screen covers the
  happy path; transactional email (e.g. via Resend) is a logical v2 addition.
- **No password reset flow** — Supabase Auth supports this out of the box, it just isn't
  wired into the UI yet.

## Running it locally

```bash
npm install
npm run dev
```

You'll need a Supabase project with a `.env` file containing:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

and the SQL migration in `supabase/migrations/` run against that project to create the
`bookings` table, its enums, and its row-level security policies.
