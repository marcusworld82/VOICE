import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      calls: {
        Row: {
          id: string;
          type: 'inbound' | 'outbound';
          caller_name: string;
          caller_phone: string;
          duration: string;
          status: 'completed' | 'missed' | 'ongoing';
          timestamp: string;
          transcript: string | null;
          recording_url: string | null;
          tenant_slug: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['calls']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['calls']['Insert']>;
      };
      appointments: {
        Row: {
          id: string;
          client_name: string;
          client_phone: string;
          client_email: string;
          service: string;
          datetime: string;
          duration: number;
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
          notes: string | null;
          tenant_slug: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>;
      };
      clients: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          status: 'active' | 'inactive' | 'prospect';
          tags: string[];
          total_appointments: number;
          total_spent: number;
          last_contact: string;
          notes: string;
          tenant_slug: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      follow_ups: {
        Row: {
          id: string;
          client_name: string;
          client_phone: string;
          client_email: string;
          last_contact: string;
          hours_elapsed: number;
          status: 'pending' | 'sent' | 'responded' | 'cancelled';
          type: 'no-booking' | 'missed-appointment' | 'follow-up-call';
          next_action: string;
          tenant_slug: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['follow_ups']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['follow_ups']['Insert']>;
      };
      config: {
        Row: {
          id: string;
          tenant_slug: string;
          business_name: string;
          business_type: string;
          service_name: string;
          average_service_price: number;
          currency: string;
          business_hours: string;
          business_location: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['config']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['config']['Insert']>;
      };
    };
  };
}