```sql
-- Create ENUM types
CREATE TYPE public.call_disposition AS ENUM (
    'BOOKED',
    'RESCHEDULED',
    'CANCELLED',
    'INFO_ONLY',
    'NO_ANSWER',
    'VOICEMAIL',
    'OUT_OF_SCOPE',
    'EMERGENCY',
    'TOXIC'
);

CREATE TYPE public.appt_status AS ENUM (
    'booked',
    'rescheduled',
    'cancelled'
);

-- New ENUMs for HMW Law retail AI
CREATE TYPE public.legal_matter_type AS ENUM (
    'criminal',
    'dui',
    'personal_injury',
    'other'
);

CREATE TYPE public.urgency_level AS ENUM (
    'low',
    'medium',
    'high',
    'emergency'
);

-- Create Tables

-- Table: public.contacts
CREATE TABLE public.contacts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id text NOT NULL,
    full_name text,
    phone text,
    email text,
    tags text[] DEFAULT '{}'::text[],
    first_seen_at timestamp with time zone DEFAULT now(),
    last_seen_at timestamp with time zone,
    -- New fields for HMW Law retail AI
    insurance_provider text,
    questions_concerns text,
    legal_matter_type public.legal_matter_type,
    urgency_level public.urgency_level
);

ALTER TABLE public.contacts OWNER TO postgres;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX contacts_pkey ON public.contacts USING btree (id);
CREATE INDEX idx_contacts_phone ON public.contacts USING btree (phone);
CREATE INDEX idx_contacts_tenant ON public.contacts USING btree (tenant_id);

ALTER TABLE public.contacts ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);

CREATE POLICY public_select_contacts ON public.contacts FOR SELECT USING (true);


-- Table: public.calls
CREATE TABLE public.calls (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id text NOT NULL,
    retell_call_id text,
    direction text DEFAULT 'inbound'::text,
    from_number text,
    to_number text,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    duration_sec integer,
    disposition public.call_disposition,
    agent_id text,
    contact_id uuid
);

ALTER TABLE public.calls OWNER TO postgres;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX calls_pkey ON public.calls USING btree (id);
CREATE UNIQUE INDEX calls_retell_call_id_key ON public.calls USING btree (retell_call_id);
CREATE INDEX idx_calls_dispo ON public.calls USING btree (disposition);
CREATE INDEX idx_calls_tenant_time ON public.calls USING btree (tenant_id, started_at DESC);

ALTER TABLE public.calls ADD CONSTRAINT calls_direction_check CHECK ((direction = ANY (ARRAY['inbound'::text, 'outbound'::text])));
ALTER TABLE public.calls ADD CONSTRAINT calls_pkey PRIMARY KEY (id);
ALTER TABLE public.calls ADD CONSTRAINT calls_retell_call_id_key UNIQUE (retell_call_id);
ALTER TABLE public.calls ADD CONSTRAINT calls_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE SET NULL;

CREATE POLICY public_select_calls ON public.calls FOR SELECT USING (true);


-- Table: public.call_analytics
CREATE TABLE public.call_analytics (
    call_id uuid NOT NULL,
    summary text,
    sentiment text,
    topics text[] DEFAULT '{}'::text[],
    intent text,
    qa_score numeric
);

ALTER TABLE public.call_analytics OWNER TO postgres;
ALTER TABLE public.call_analytics ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX call_analytics_pkey ON public.call_analytics USING btree (call_id);

ALTER TABLE public.call_analytics ADD CONSTRAINT call_analytics_pkey PRIMARY KEY (call_id);
ALTER TABLE public.call_analytics ADD CONSTRAINT call_analytics_call_id_fkey FOREIGN KEY (call_id) REFERENCES public.calls(id) ON DELETE CASCADE;

CREATE POLICY public_select_call_analytics ON public.call_analytics FOR SELECT USING (true);


-- Table: public.appointments
CREATE TABLE public.appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id text NOT NULL,
    calendar_event_id text,
    contact_id uuid,
    service_name text,
    start_at timestamp with time zone,
    end_at timestamp with time zone,
    status public.appt_status DEFAULT 'booked'::public.appt_status NOT NULL,
    price_estimate numeric,
    booked_via text DEFAULT 'agent'::text
);

ALTER TABLE public.appointments OWNER TO postgres;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX appointments_calendar_event_id_key ON public.appointments USING btree (calendar_event_id);
CREATE UNIQUE INDEX appointments_pkey ON public.appointments USING btree (id);
CREATE INDEX idx_appts_status ON public.appointments USING btree (status);
CREATE INDEX idx_appts_tenant_time ON public.appointments USING btree (tenant_id, start_at DESC);

ALTER TABLE public.appointments ADD CONSTRAINT appointments_calendar_event_id_key UNIQUE (calendar_event_id);
ALTER TABLE public.appointments ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);
ALTER TABLE public.appointments ADD CONSTRAINT appointments_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE SET NULL;

CREATE POLICY public_select_appointments ON public.appointments FOR SELECT USING (true);


-- Table: public.config
CREATE TABLE public.config (
    tenant_id text NOT NULL,
    business_name text,
    address text,
    phone text,
    website text,
    avg_service_price numeric DEFAULT 0,
    cost_per_call numeric DEFAULT 0,
    business_hours jsonb,
    booking_link text,
    -- New fields for HMW Law retail AI
    support_emails text[],
    appointment_duration_minutes integer,
    advance_booking_min_hours integer,
    advance_booking_max_days integer,
    emergency_protocol_text text,
    payment_policy_text text,
    cancellation_policy_text text,
    free_consultation_offered boolean DEFAULT FALSE,
    contact_form_url text,
    faqs jsonb
);

ALTER TABLE public.config OWNER TO postgres;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX config_pkey ON public.config USING btree (tenant_id);

ALTER TABLE public.config ADD CONSTRAINT config_pkey PRIMARY KEY (tenant_id);

CREATE POLICY public_select_config ON public.config FOR SELECT USING (true);


-- Views (if any, from your original schema)
CREATE OR REPLACE VIEW public.kpi_daily AS
 SELECT c.tenant_id,
    "date_trunc"('day'::text, c.started_at) AS day,
    count(c.id) FILTER (WHERE (c.direction = 'inbound'::text)) AS inbound_calls,
    count(c.id) FILTER (WHERE (c.disposition = 'BOOKED'::public.call_disposition)) AS booked_calls,
    count(c.id) FILTER (WHERE (c.disposition = 'VOICEMAIL'::public.call_disposition)) AS voicemails,
    avg(c.duration_sec) AS avg_handle_sec,
    (count(c.id) FILTER (WHERE (c.disposition = 'BOOKED'::public.call_disposition))::numeric / count(c.id)::numeric) AS booking_rate
   FROM public.calls c
  GROUP BY c.tenant_id, ("date_trunc"('day'::text, c.started_at));

ALTER TABLE public.kpi_daily OWNER TO postgres;

CREATE OR REPLACE VIEW public.kpi_roi AS
 SELECT c.tenant_id,
    (sum(cfg.avg_service_price) FILTER (WHERE (a.status = 'booked'::public.appt_status)) * (0.8)::numeric) AS est_revenue,
    (sum(cfg.cost_per_call) FILTER (WHERE (c_1.disposition = 'VOICEMAIL'::public.call_disposition)) * (0.5)::numeric) AS est_savings_after_hours
   FROM public.appointments a
     JOIN public.calls c_1 ON (a.contact_id = c_1.contact_id)
     JOIN public.config cfg ON ((a.tenant_id = cfg.tenant_id))
  GROUP BY c.tenant_id;

ALTER TABLE public.kpi_roi OWNER TO postgres;


-- RLS Function for tenant isolation
CREATE OR REPLACE FUNCTION public.set_config(setting_name text, setting_value text, is_local boolean DEFAULT true)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF is_local THEN
    EXECUTE format('SET LOCAL %I = %L', setting_name, setting_value);
  ELSE
    EXECUTE format('SET %I = %L', setting_name, setting_value);
  END IF;
  RETURN setting_value;
END;
$function$;

ALTER FUNCTION public.set_config(text, text, boolean) OWNER TO postgres;

-- Initial data for HMW Law config (example, adjust as needed)
INSERT INTO public.config (
    tenant_id,
    business_name,
    address,
    phone,
    website,
    avg_service_price,
    business_hours,
    booking_link,
    support_emails,
    appointment_duration_minutes,
    advance_booking_min_hours,
    advance_booking_max_days,
    emergency_protocol_text,
    payment_policy_text,
    cancellation_policy_text,
    free_consultation_offered,
    contact_form_url,
    faqs
) VALUES (
    'hmw-law', -- Replace with your actual tenant_id if different
    'HMW Law',
    '1231 Superior Ave, Suite 200, Cleveland, OH 44114',
    '(216) 774-0000',
    'https://teamhmwwins.com', -- Example website
    100.00, -- Example average service price for consultation
    '{"monday": "9:00 AM - 5:00 PM", "tuesday": "9:00 AM - 5:00 PM", "wednesday": "9:00 AM - 5:00 PM", "thursday": "9:00 AM - 5:00 PM", "friday": "9:00 AM - 5:00 PM"}', -- Example JSONB for business hours
    'https://calendly.com/hmw-law/booking', -- Example booking link
    ARRAY['admin@teamhmwwins.com', 'bh@teamhmwwins.com'],
    60,
    24,
    30,
    'For urgent arrests or police matters, escalate for same-day consultation',
    'Initial consultation fees disclosed upfront',
    'At least 24 hours’ notice required',
    TRUE,
    'https://teamhmwwins.com/contact',
    '[
        {"question": "What are the differences between a civil case and a criminal case?", "answer": "Civil cases involve disputes between individuals or organizations, while criminal cases involve a violation of public law."},
        {"question": "Why is it important to hire an attorney as soon as I am charged with a crime?", "answer": "Hiring an attorney early can protect your rights, help you understand charges, and build a strong defense from the start."},
        {"question": "What are the differences between a felony and a misdemeanor?", "answer": "Felonies are serious crimes punishable by imprisonment for more than a year, while misdemeanors are less serious crimes with lighter penalties."},
        {"question": "What happens if I was injured and my insurance claim is denied?", "answer": "If your insurance claim is denied, an attorney can help you appeal the decision, negotiate with the insurance company, or pursue legal action."},
        {"question": "Why can’t I just represent myself without an attorney?", "answer": "Legal processes are complex. An attorney provides expertise, navigates legal procedures, and advocates for your best interests, which is difficult to do effectively on your own."}
    ]'::jsonb
) ON CONFLICT (tenant_id) DO NOTHING; -- Prevents re-inserting if tenant_id already exists
```