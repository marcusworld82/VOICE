/*
  # Initial AI Receptionist Schema

  1. New Tables
    - `calls` - Store all call records with transcripts and recordings
    - `appointments` - Manage appointment bookings and scheduling
    - `clients` - Client relationship management and contact info
    - `follow_ups` - Smart follow-up tracking and automation
    - `business_config` - Business configuration and settings per tenant

  2. Security
    - Enable RLS on all tables
    - Add policies for tenant-based access control
    - Ensure data isolation between different businesses

  3. Indexes
    - Add performance indexes for common queries
    - Optimize for tenant-based filtering
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Calls table
CREATE TABLE IF NOT EXISTS calls (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('inbound', 'outbound')),
  caller_name text NOT NULL,
  caller_phone text NOT NULL,
  duration text NOT NULL,
  status text NOT NULL CHECK (status IN ('completed', 'missed', 'ongoing')),
  timestamp timestamptz NOT NULL,
  transcript text,
  recording_url text,
  tenant_slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_email text NOT NULL,
  service text NOT NULL,
  datetime timestamptz NOT NULL,
  duration integer NOT NULL DEFAULT 60,
  status text NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')) DEFAULT 'scheduled',
  notes text,
  tenant_slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'prospect')) DEFAULT 'prospect',
  tags text[] DEFAULT '{}',
  total_appointments integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  last_contact timestamptz DEFAULT now(),
  notes text DEFAULT '',
  tenant_slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Follow-ups table
CREATE TABLE IF NOT EXISTS follow_ups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_email text,
  last_contact timestamptz NOT NULL,
  hours_elapsed integer NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('pending', 'sent', 'responded', 'cancelled')) DEFAULT 'pending',
  type text NOT NULL CHECK (type IN ('no-booking', 'missed-appointment', 'follow-up-call')),
  next_action text NOT NULL,
  tenant_slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Business configuration table
CREATE TABLE IF NOT EXISTS business_config (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_slug text NOT NULL UNIQUE,
  business_name text NOT NULL DEFAULT 'Your Business',
  business_type text NOT NULL DEFAULT 'general',
  service_name text NOT NULL DEFAULT 'consultation',
  average_service_price numeric NOT NULL DEFAULT 100,
  currency text NOT NULL DEFAULT 'USD',
  business_hours text NOT NULL DEFAULT '9 AM - 5 PM, Monday - Friday',
  business_location text NOT NULL DEFAULT '123 Main Street, City, State',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_config ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant-based access
CREATE POLICY "Users can access their tenant's calls"
  ON calls
  FOR ALL
  USING (tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Users can access their tenant's appointments"
  ON appointments
  FOR ALL
  USING (tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Users can access their tenant's clients"
  ON clients
  FOR ALL
  USING (tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Users can access their tenant's follow_ups"
  ON follow_ups
  FOR ALL
  USING (tenant_slug = current_setting('app.current_tenant', true));

CREATE POLICY "Users can access their tenant's business_config"
  ON business_config
  FOR ALL
  USING (tenant_slug = current_setting('app.current_tenant', true));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calls_tenant_timestamp ON calls(tenant_slug, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_datetime ON appointments(tenant_slug, datetime);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_clients_tenant_name ON clients(tenant_slug, name);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_tenant_status ON follow_ups(tenant_slug, status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_hours_elapsed ON follow_ups(hours_elapsed);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for business_config updated_at
CREATE TRIGGER update_business_config_updated_at
  BEFORE UPDATE ON business_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();