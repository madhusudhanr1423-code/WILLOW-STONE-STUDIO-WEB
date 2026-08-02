-- Services & pricing, owned by the business, editable by the owner
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name public.service_type NOT NULL UNIQUE,
  duration_minutes INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Owners can manage services"
  ON public.services FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'owner'))
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

-- Seed with the current hardcoded pricing so the site keeps working immediately
INSERT INTO public.services (name, duration_minutes, price_cents, tagline, sort_order, description) VALUES
  ('Consultation', 60, 8500, 'First appointment',
    0, 'A relaxed first session where we go through your goals, any areas of tension or discomfort, and your general habits — then map out a plan that fits your life.'),
  ('Checkup', 50, 9500, 'Most popular',
    1, 'A thorough hands-on session covering movement, rest and everyday habits, with therapeutic massage focused on whatever''s come up since your last visit.'),
  ('Follow-up', 30, 6000, 'Maintenance',
    2, 'A focused catch-up to track progress since your last session and adjust your plan as things change — ideal for ongoing maintenance between full sessions.');

-- Blocked availability: whole days off, or specific time slots blocked on a given day
CREATE TABLE public.blocked_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocked_date DATE NOT NULL,
  blocked_time TEXT, -- NULL means the entire day is blocked
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (blocked_date, blocked_time)
);

ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blocked slots"
  ON public.blocked_slots FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Owners can manage blocked slots"
  ON public.blocked_slots FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'owner'))
  WITH CHECK (public.has_role(auth.uid(), 'owner'));
