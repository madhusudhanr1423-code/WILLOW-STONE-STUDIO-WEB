CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','cancelled');
CREATE TYPE public.service_type AS ENUM ('Consultation','Checkup','Follow-up');

CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service public.service_type NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status public.booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Bookings are viewable" ON public.bookings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Booking status can be updated" ON public.bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX bookings_date_time_idx ON public.bookings (appointment_date, appointment_time);