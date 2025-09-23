interface CallData {
  id: string;
  type: 'inbound' | 'outbound';
  caller: {
    name: string;
    phone: string;
  };
  duration: string;
  status: 'completed' | 'missed' | 'ongoing';
  timestamp: string;
  transcript?: string;
  recording?: string;
}

interface AppointmentData {
  id: string;
  client: {
    name: string;
    phone: string;
    email: string;
  };
  service: string;
  datetime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

interface ClientData {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'prospect';
  tags: string[];
  totalAppointments: number;
  totalSpent: number;
  lastContact: string;
  notes: string;
}

interface FollowUpData {
  id: string;
  client: string;
  phone: string;
  email: string;
  lastContact: string;
  hoursElapsed: number;
  status: 'pending' | 'sent' | 'responded' | 'cancelled';
  type: 'no-booking' | 'missed-appointment' | 'follow-up-call';
  nextAction: string;
}

interface WebhookPayload {
  event: string;
  timestamp: string;
  tenantSlug: string;
  data: any;
  metadata?: {
    source: string;
    version: string;
    userId?: string;
  };
}

class WebhookService {
  private webhookUrl: string;
  private tenantSlug: string;

  constructor() {
    // Get webhook URL from environment variable
    this.webhookUrl = import.meta.env.VITE_WEBHOOK_SERVICE_URL || '';
    // Get tenant slug from config
    const config = this.loadConfig();
    this.tenantSlug = config.tenantSlug || 'default';
  }

  private loadConfig() {
    try {
      const saved = localStorage.getItem('voicehub_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    return { tenantSlug: '', bookingLink: '' };
  }

  private async sendWebhook(payload: WebhookPayload): Promise<boolean> {
    try {
      // Skip webhook if URL is not configured
      if (!this.webhookUrl) {
        console.warn('Webhook URL not configured, skipping webhook:', payload.event);
        return false;
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AI-Receptionist-Dashboard/1.0',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      console.log('Webhook sent successfully:', payload.event);
      return true;
    } catch (error) {
      console.error('Webhook error:', error);
      return false;
    }
  }

  // Call Events
  async sendCallCompleted(callData: CallData): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'call.completed',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        call: callData,
        metrics: {
          duration: callData.duration,
          successful: callData.status === 'completed',
        }
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  async sendCallMissed(callData: CallData): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'call.missed',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        call: callData,
        followUpRequired: true,
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  // Appointment Events
  async sendAppointmentBooked(appointmentData: AppointmentData): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'appointment.booked',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        appointment: appointmentData,
        client: appointmentData.client,
        booking: {
          service: appointmentData.service,
          datetime: appointmentData.datetime,
          duration: appointmentData.duration,
        }
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  async sendAppointmentConfirmed(appointmentData: AppointmentData): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'appointment.confirmed',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        appointment: appointmentData,
        client: appointmentData.client,
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  async sendAppointmentRescheduled(appointmentData: AppointmentData, oldDateTime: string): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'appointment.rescheduled',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        appointment: appointmentData,
        client: appointmentData.client,
        changes: {
          oldDateTime,
          newDateTime: appointmentData.datetime,
        }
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  // Client Events
  async sendClientCreated(clientData: ClientData): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'client.created',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        client: clientData,
        source: 'manual_entry',
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  async sendClientUpdated(clientData: ClientData, changes: Partial<ClientData>): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'client.updated',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        client: clientData,
        changes,
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  // Follow-up Events
  async sendFollowUpTriggered(followUpData: FollowUpData): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'followup.triggered',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        followUp: followUpData,
        client: {
          name: followUpData.client,
          phone: followUpData.phone,
          email: followUpData.email,
        },
        trigger: {
          type: followUpData.type,
          hoursElapsed: followUpData.hoursElapsed,
        }
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  // Analytics Events
  async sendDailyMetrics(metrics: any): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'analytics.daily_metrics',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        date: new Date().toISOString().split('T')[0],
        metrics: {
          calls: {
            total: metrics.totalCalls,
            completed: metrics.completedCalls,
            missed: metrics.missedCalls,
          },
          appointments: {
            total: metrics.totalAppointments,
            confirmed: metrics.confirmedAppointments,
            pending: metrics.pendingAppointments,
          },
          revenue: {
            total: metrics.totalRevenue,
            conversions: metrics.totalConversions,
            conversionRate: metrics.conversionRate,
          }
        }
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  // Integration Events
  async sendIntegrationConfigured(service: string, config: any): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'integration.configured',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        service,
        configuration: {
          connected: config.connected,
          // Don't send sensitive data like API keys
          hasApiKey: !!config.apiKey,
          hasWebhookUrl: !!config.webhookUrl,
        }
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  // Business Configuration Events
  async sendBusinessConfigUpdated(config: any): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'business.config_updated',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        businessConfig: config,
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }

  // Test webhook connection
  async testConnection(): Promise<boolean> {
    const payload: WebhookPayload = {
      event: 'system.test',
      timestamp: new Date().toISOString(),
      tenantSlug: this.tenantSlug,
      data: {
        message: 'Test webhook connection from AI Receptionist Dashboard',
        status: 'healthy',
      },
      metadata: {
        source: 'dashboard',
        version: '1.0',
      }
    };

    return this.sendWebhook(payload);
  }
}

export const webhookService = new WebhookService();
export type { CallData, AppointmentData, ClientData, FollowUpData, WebhookPayload };