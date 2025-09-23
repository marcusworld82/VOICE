/*
  # Add HMW Law retail AI fields

  1. New Columns for Contacts Table
    - `insurance_provider` (text) - Client's insurance provider
    - `questions_concerns` (text) - Client's questions and concerns
    - `legal_matter_type` (text) - Type of legal matter (criminal, DUI, personal injury)
    - `urgency_level` (text) - Urgency level (low, medium, high, emergency)

  2. New Columns for Config Table
    - `support_emails` (text[]) - Support email addresses
    - `appointment_duration_minutes` (integer) - Default appointment duration
    - `advance_booking_min_hours` (integer) - Minimum advance booking time
    - `advance_booking_max_days` (integer) - Maximum advance booking time
    - `emergency_protocol_text` (text) - Emergency protocol instructions
    - `payment_policy_text` (text) - Payment policy details
    - `cancellation_policy_text` (text) - Cancellation policy details
    - `free_consultation_offered` (boolean) - Whether free consultations are offered
    - `contact_form_url` (text) - Contact form URL
    - `faqs` (jsonb) - Frequently asked questions

  3. Create Enums
    - `legal_matter_type` enum for standardized legal matter categories
    - `urgency_level` enum for standardized urgency levels
*/

-- Create enums for better data consistency
CREATE TYPE legal_matter_type AS ENUM ('criminal', 'dui', 'personal_injury', 'other');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'emergency');

-- Add new columns to contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS insurance_provider text,
ADD COLUMN IF NOT EXISTS questions_concerns text,
ADD COLUMN IF NOT EXISTS legal_matter_type legal_matter_type,
ADD COLUMN IF NOT EXISTS urgency_level urgency_level DEFAULT 'medium';

-- Add new columns to config table
ALTER TABLE config 
ADD COLUMN IF NOT EXISTS support_emails text[],
ADD COLUMN IF NOT EXISTS appointment_duration_minutes integer DEFAULT 60,
ADD COLUMN IF NOT EXISTS advance_booking_min_hours integer DEFAULT 24,
ADD COLUMN IF NOT EXISTS advance_booking_max_days integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS emergency_protocol_text text,
ADD COLUMN IF NOT EXISTS payment_policy_text text,
ADD COLUMN IF NOT EXISTS cancellation_policy_text text,
ADD COLUMN IF NOT EXISTS free_consultation_offered boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS contact_form_url text,
ADD COLUMN IF NOT EXISTS faqs jsonb;

-- Insert default HMW Law configuration
INSERT INTO config (
  tenant_id,
  business_name,
  address,
  phone,
  website,
  support_emails,
  appointment_duration_minutes,
  advance_booking_min_hours,
  advance_booking_max_days,
  emergency_protocol_text,
  payment_policy_text,
  cancellation_policy_text,
  free_consultation_offered,
  contact_form_url,
  business_hours,
  faqs
) VALUES (
  'hmw-law',
  'HMW Law',
  '1231 Superior Ave, Suite 200, Cleveland, OH 44114',
  '(216) 774-0000',
  'https://teamhmwwins.com',
  ARRAY['admin@teamhmwwins.com', 'bh@teamhmwwins.com'],
  60,
  24,
  30,
  'For urgent arrests or police matters, escalate for same-day consultation',
  'Initial consultation fees disclosed upfront',
  'At least 24 hours notice required',
  true,
  'https://teamhmwwins.com/contact',
  '{"monday": "9:00 AM - 5:00 PM", "tuesday": "9:00 AM - 5:00 PM", "wednesday": "9:00 AM - 5:00 PM", "thursday": "9:00 AM - 5:00 PM", "friday": "9:00 AM - 5:00 PM", "saturday": "Closed", "sunday": "Closed"}',
  '[
    {
      "question": "What are the differences between a civil case and a criminal case?",
      "answer": "A civil case involves disputes between private parties seeking monetary damages or other remedies, while a criminal case involves the government prosecuting someone for violating criminal laws, potentially resulting in fines or imprisonment."
    },
    {
      "question": "Why is it important to hire an attorney as soon as I am charged with a crime?",
      "answer": "Early legal representation protects your rights, helps avoid self-incrimination, ensures proper handling of evidence, and allows your attorney to build the strongest possible defense from the beginning."
    },
    {
      "question": "What are the differences between a felony and a misdemeanor?",
      "answer": "Felonies are more serious crimes typically punishable by more than one year in prison, while misdemeanors are less serious offenses usually punishable by up to one year in jail and/or fines."
    },
    {
      "question": "What happens if I was injured and my insurance claim is denied?",
      "answer": "If your insurance claim is denied, you may have options including appealing the decision, filing a bad faith claim, or pursuing legal action. We can review your case and help determine the best course of action."
    },
    {
      "question": "Why can''t I just represent myself without an attorney?",
      "answer": "The legal system is complex, and self-representation often leads to unfavorable outcomes. Attorneys understand legal procedures, evidence rules, and negotiation strategies that can significantly impact your case results."
    }
  ]'::jsonb
) ON CONFLICT (tenant_id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  support_emails = EXCLUDED.support_emails,
  appointment_duration_minutes = EXCLUDED.appointment_duration_minutes,
  advance_booking_min_hours = EXCLUDED.advance_booking_min_hours,
  advance_booking_max_days = EXCLUDED.advance_booking_max_days,
  emergency_protocol_text = EXCLUDED.emergency_protocol_text,
  payment_policy_text = EXCLUDED.payment_policy_text,
  cancellation_policy_text = EXCLUDED.cancellation_policy_text,
  free_consultation_offered = EXCLUDED.free_consultation_offered,
  contact_form_url = EXCLUDED.contact_form_url,
  business_hours = EXCLUDED.business_hours,
  faqs = EXCLUDED.faqs;