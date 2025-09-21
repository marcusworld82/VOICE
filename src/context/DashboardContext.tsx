import React, { createContext, useContext, useState } from 'react';

export interface PanelConfig {
  id: string;
  title: string;
  component: string;
  enabled: boolean;
  category: 'core' | 'value';
  gridArea?: string;
}

interface DashboardContextType {
  panels: PanelConfig[];
  togglePanel: (panelId: string) => void;
  businessConfig: {
    businessType: string;
    businessName: string;
    serviceName: string;
    averageServicePrice: number;
    currency: string;
  };
  updateBusinessConfig: (config: any) => void;
  integrations: {
    vapi: { apiKey: string; connected: boolean };
    n8n: { webhookUrl: string; connected: boolean };
    googleCalendar: { apiKey: string; connected: boolean };
    stripe: { apiKey: string; connected: boolean };
  };
  updateIntegration: (service: string, config: any) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const defaultPanels: PanelConfig[] = [
  { id: 'call-tracking', title: 'Call Tracking', component: 'CallTracking', enabled: true, category: 'core' },
  { id: 'voice-agent', title: 'AI Voice Agent', component: 'VoiceAgentConfig', enabled: true, category: 'core' },
  { id: 'appointments', title: 'Appointment Bookings', component: 'Appointments', enabled: true, category: 'core' },
  { id: 'client-info', title: 'Client Information', component: 'ClientInfo', enabled: true, category: 'core' },
  { id: 'roi-analytics', title: 'ROI Analytics', component: 'ROIAnalytics', enabled: true, category: 'core' },
  { id: 'integrations', title: 'Integrations', component: 'Integrations', enabled: true, category: 'core' },
  { id: 'missed-calls', title: 'Missed Calls & Voicemail', component: 'MissedCalls', enabled: true, category: 'value' },
  { id: 'quick-notes', title: 'Quick Notes & Tags', component: 'QuickNotes', enabled: true, category: 'value' },
  { id: 'smart-followups', title: 'Smart Follow-Ups', component: 'SmartFollowUps', enabled: true, category: 'value' },
  { id: 'live-status', title: 'Live Status Board', component: 'LiveStatus', enabled: true, category: 'value' },
  { id: 'revenue-estimator', title: 'Revenue Estimator', component: 'RevenueEstimator', enabled: true, category: 'value' },
  { id: 'multi-channel', title: 'Multi-Channel Log', component: 'MultiChannel', enabled: true, category: 'value' },
];

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [panels, setPanels] = useState<PanelConfig[]>(defaultPanels);
  const [businessConfig, setBusinessConfig] = useState({
    businessType: 'general',
    businessName: 'Your Business',
    serviceName: 'consultation',
    averageServicePrice: 100,
    currency: 'USD'
  });
  const [integrations, setIntegrations] = useState({
    vapi: { apiKey: '', connected: false },
    n8n: { webhookUrl: '', connected: false },
    googleCalendar: { apiKey: '', connected: false },
    stripe: { apiKey: '', connected: false },
  });

  const togglePanel = (panelId: string) => {
    setPanels(prev => prev.map(panel => 
      panel.id === panelId ? { ...panel, enabled: !panel.enabled } : panel
    ));
  };

  const updateBusinessConfig = (config: any) => {
    setBusinessConfig(prev => ({ ...prev, ...config }));
  };

  const updateIntegration = (service: string, config: any) => {
    setIntegrations(prev => ({
      ...prev,
      [service]: { ...prev[service as keyof typeof prev], ...config }
    }));
  };

  return (
    <DashboardContext.Provider value={{
      panels,
      togglePanel,
      businessConfig,
      updateBusinessConfig,
      integrations,
      updateIntegration
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};