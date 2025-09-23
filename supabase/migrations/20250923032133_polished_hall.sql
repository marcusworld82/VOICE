/*
  # Create complete database schema for AI Receptionist Dashboard

  1. New Tables
    - `calls` - Call records with transcripts and recordings
    - `appointments` - Appointment bookings and scheduling  
    - `clients` - Client relationship management
    - `follow_ups` - Smart follow-up tracking
    - `config` - Business configuration per tenant

  2. Security
    - Enable RLS on all tables
    - Add tenant-based policies for data isolation
    - Create set_config function for RLS context

  3. Features
    - Automatic timestamps
    - Default values for better data consistency
    - Proper indexing for performance
    - Update trigger for config table
*/

-- Create the 'calls' table
CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound')),
  caller_name TEXT NOT NULL,
  caller_phone TEXT NOT NULL,
  duration TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'missed', 'ongoing')),
  timestamp TEXT NOT NULL,
  transcript TEXT,
  recording_url TEXT,
  tenant_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users based on tenant_slug" ON public.calls 
FOR SELECT USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable insert for authenticated users based on tenant_slug" ON public.calls 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable update for authenticated users based on tenant_slug" ON public.calls 
FOR UPDATE USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable delete for authenticated users based on tenant_slug" ON public.calls 
FOR DELETE USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_calls_tenant_timestamp ON public.calls(tenant_slug, timestamp);

-- Create the 'appointments' table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  service TEXT NOT NULL,
  datetime TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes TEXT,
  tenant_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users based on tenant_slug" ON public.appointments 
FOR SELECT USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable insert for authenticated users based on tenant_slug" ON public.appointments 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable update for authenticated users based on tenant_slug" ON public.appointments 
FOR UPDATE USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable delete for authenticated users based on tenant_slug" ON public.appointments 
FOR DELETE USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_datetime ON public.appointments(tenant_slug, datetime);

-- Create the 'clients' table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'prospect' CHECK (status IN ('active', 'inactive', 'prospect')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  total_appointments INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  last_contact TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  tenant_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users based on tenant_slug" ON public.clients 
FOR SELECT USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable insert for authenticated users based on tenant_slug" ON public.clients 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable update for authenticated users based on tenant_slug" ON public.clients 
FOR UPDATE USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable delete for authenticated users based on tenant_slug" ON public.clients 
FOR DELETE USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_tenant_name ON public.clients(tenant_slug, name);
CREATE INDEX IF NOT EXISTS idx_clients_tenant_phone ON public.clients(tenant_slug, phone);
CREATE INDEX IF NOT EXISTS idx_clients_tenant_email ON public.clients(tenant_slug, email);

-- Create the 'follow_ups' table
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  last_contact TEXT NOT NULL,
  hours_elapsed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'responded', 'cancelled')),
  type TEXT NOT NULL CHECK (type IN ('no-booking', 'missed-appointment', 'follow-up-call')),
  next_action TEXT NOT NULL,
  tenant_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users based on tenant_slug" ON public.follow_ups 
FOR SELECT USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable insert for authenticated users based on tenant_slug" ON public.follow_ups 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable update for authenticated users based on tenant_slug" ON public.follow_ups 
FOR UPDATE USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable delete for authenticated users based on tenant_slug" ON public.follow_ups 
FOR DELETE USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_follow_ups_tenant_status ON public.follow_ups(tenant_slug, status);

-- Create the 'config' table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_slug TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL DEFAULT 'My Business',
  business_type TEXT NOT NULL DEFAULT 'Service Business',
  service_name TEXT NOT NULL DEFAULT 'Consultation',
  average_service_price INTEGER NOT NULL DEFAULT 100,
  currency TEXT NOT NULL DEFAULT 'USD',
  business_hours TEXT NOT NULL DEFAULT '9:00 AM - 5:00 PM',
  business_location TEXT NOT NULL DEFAULT 'Main Office',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users based on tenant_slug" ON public.config 
FOR SELECT USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable insert for authenticated users based on tenant_slug" ON public.config 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable update for authenticated users based on tenant_slug" ON public.config 
FOR UPDATE USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Enable delete for authenticated users based on tenant_slug" ON public.config 
FOR DELETE USING (auth.uid() IS NOT NULL AND tenant_slug = current_setting('app.current_tenant', true));

-- Add a trigger to update 'updated_at' column automatically for 'config' table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_config_updated_at') THEN
        CREATE TRIGGER update_config_updated_at
        BEFORE UPDATE ON public.config
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create the 'set_config' function for RLS
CREATE OR REPLACE FUNCTION public.set_config(setting_name TEXT, setting_value TEXT, is_local BOOLEAN DEFAULT TRUE)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config(setting_name, setting_value, is_local);
END;
$$ LANGUAGE plpgsql;

-- Grant usage on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.set_config(TEXT, TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_config(TEXT, TEXT, BOOLEAN) TO anon;