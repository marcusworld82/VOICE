import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { loadConfig } from '../lib/config';

export function useSupabase() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const { tenantSlug } = loadConfig();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Set tenant context for RLS
        if (tenantSlug) {
          await supabase.rpc('set_config', {
            setting_name: 'app.current_tenant',
            setting_value: tenantSlug,
            is_local: true
          });
        }

        // Test connection
        const { error } = await supabase.from('business_config').select('count').limit(1);
        setIsConnected(!error);
      } catch (error) {
        console.error('Supabase connection error:', error);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, [tenantSlug]);

  return { isConnected, loading, tenantSlug };
}

// Database service functions
export const dbService = {
  // Calls
  async createCall(callData: any) {
    const { tenantSlug } = loadConfig();
    const { data, error } = await supabase
      .from('calls')
      .insert({ ...callData, tenant_slug: tenantSlug })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCalls(limit = 50) {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Appointments
  async createAppointment(appointmentData: any) {
    const { tenantSlug } = loadConfig();
    const { data, error } = await supabase
      .from('appointments')
      .insert({ ...appointmentData, tenant_slug: tenantSlug })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAppointments(limit = 50) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('datetime', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async updateAppointment(id: string, updates: any) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Clients
  async createClient(clientData: any) {
    const { tenantSlug } = loadConfig();
    const { data, error } = await supabase
      .from('clients')
      .insert({ ...clientData, tenant_slug: tenantSlug })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getClients(limit = 100) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async updateClient(id: string, updates: any) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Follow-ups
  async createFollowUp(followUpData: any) {
    const { tenantSlug } = loadConfig();
    const { data, error } = await supabase
      .from('follow_ups')
      .insert({ ...followUpData, tenant_slug: tenantSlug })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getFollowUps(status?: string) {
    let query = supabase
      .from('follow_ups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Business Config
  async getBusinessConfig() {
    const { tenantSlug } = loadConfig();
    const { data, error } = await supabase
      .from('business_config')
      .select('*')
      .eq('tenant_slug', tenantSlug)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async upsertBusinessConfig(configData: any) {
    const { tenantSlug } = loadConfig();
    const { data, error } = await supabase
      .from('business_config')
      .upsert({ ...configData, tenant_slug: tenantSlug })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};