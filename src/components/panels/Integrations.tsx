import React, { useState } from 'react';
import { Settings, Plug, Check, X, Key, Globe } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function Integrations() {
  const { integrations, updateIntegration, businessConfig, updateBusinessConfig } = useDashboard();
  const [activeTab, setActiveTab] = useState<'api-keys' | 'business-config'>('api-keys');
  const [tempKeys, setTempKeys] = useState({
    vapi: integrations.vapi.apiKey,
    n8n: integrations.n8n.webhookUrl,
    googleCalendar: integrations.googleCalendar.apiKey,
    stripe: integrations.stripe.apiKey,
  });

  const handleSaveKey = (service: string, key: string) => {
    updateIntegration(service, { 
      apiKey: service === 'n8n' ? undefined : key,
      webhookUrl: service === 'n8n' ? key : undefined,
      connected: key.length > 0 
    });
  };

  const integrationConfigs = [
    {
      id: 'vapi',
      name: 'Vapi',
      description: 'AI Voice Assistant Platform',
      status: integrations.vapi.connected,
      type: 'API Key',
      placeholder: 'vapi_sk_...',
      icon: '🎤',
      color: 'from-blue-500 to-blue-600',
      docs: 'https://docs.vapi.ai'
    },
    {
      id: 'n8n',
      name: 'n8n Workflow',
      description: 'Automation & Workflow Engine',
      status: integrations.n8n.connected,
      type: 'Webhook URL',
      placeholder: 'https://n8n.yourapp.com/webhook/...',
      icon: '⚡',
      color: 'from-purple-500 to-purple-600',
      docs: 'https://docs.n8n.io'
    },
    {
      id: 'googleCalendar',
      name: 'Google Calendar',
      description: 'Calendar Integration & Scheduling',
      status: integrations.googleCalendar.connected,
      type: 'API Key',
      placeholder: 'AIzaSy...',
      icon: '📅',
      color: 'from-green-500 to-green-600',
      docs: 'https://developers.google.com/calendar'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment Processing',
      status: integrations.stripe.connected,
      type: 'API Key',
      placeholder: 'sk_test_... or sk_live_...',
      icon: '💳',
      color: 'from-indigo-500 to-indigo-600',
      docs: 'https://stripe.com/docs'
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Integrations</h2>
            <p className="text-gray-400 text-sm">API connections & business config</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('api-keys')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'api-keys'
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>API Keys</span>
        </button>
        <button
          onClick={() => setActiveTab('business-config')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'business-config'
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Business Config</span>
        </button>
      </div>

      {activeTab === 'api-keys' && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {integrationConfigs.map((config) => (
            <div key={config.id} className="p-4 bg-black/30 rounded-xl border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center text-lg`}>
                    {config.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold">{config.name}</h3>
                      {config.status ? (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs border border-green-500/20">
                          <Check className="w-3 h-3" />
                          <span>Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/10 text-red-400 rounded-full text-xs border border-red-500/20">
                          <X className="w-3 h-3" />
                          <span>Not Connected</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{config.description}</p>
                  </div>
                </div>
                <a
                  href={config.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm underline"
                >
                  Docs
                </a>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {config.type}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type={config.id === 'n8n' ? 'url' : 'password'}
                      value={tempKeys[config.id as keyof typeof tempKeys]}
                      onChange={(e) => setTempKeys(prev => ({ ...prev, [config.id]: e.target.value }))}
                      placeholder={config.placeholder}
                      className="flex-1 px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                    />
                    <button
                      onClick={() => handleSaveKey(config.id, tempKeys[config.id as keyof typeof tempKeys])}
                      className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {config.id === 'vapi' && (
                  <div className="text-xs text-gray-400">
                    <p>• Handles all voice calls and AI conversations</p>
                    <p>• Integrates with your phone system for call routing</p>
                  </div>
                )}
                {config.id === 'n8n' && (
                  <div className="text-xs text-gray-400">
                    <p>• Processes appointment bookings via Gemini AI workflow</p>
                    <p>• Syncs with Google Calendar automatically</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'business-config' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Type
              </label>
              <select
                value={businessConfig.businessType}
                onChange={(e) => updateBusinessConfig({ businessType: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              >
                <option value="general">General Business</option>
                <option value="dental">Dental Practice</option>
                <option value="medical">Medical Practice</option>
                <option value="legal">Legal Services</option>
                <option value="coaching">Coaching/Consulting</option>
                <option value="salon">Salon/Spa</option>
                <option value="fitness">Fitness/Wellness</option>
                <option value="real-estate">Real Estate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={businessConfig.serviceName}
                onChange={(e) => updateBusinessConfig({ serviceName: e.target.value })}
                placeholder="e.g., consultation, appointment, session"
                className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Average Service Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={businessConfig.averageServicePrice}
                  onChange={(e) => updateBusinessConfig({ averageServicePrice: parseInt(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={businessConfig.currency}
                onChange={(e) => updateBusinessConfig({ currency: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20">
            <h4 className="text-blue-400 font-medium mb-2">Business Configuration Preview</h4>
            <p className="text-gray-300 text-sm">
              Your AI receptionist will handle <strong>{businessConfig.serviceName}</strong> bookings for your{' '}
              <strong>{businessConfig.businessType}</strong> business, with an average service price of{' '}
              <strong>${businessConfig.averageServicePrice} {businessConfig.currency}</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}