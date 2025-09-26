import React, { useState } from 'react';
import { Settings, Key, Mic, Plug, Save, Eye, EyeOff, Copy } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import SupabaseStatus from '../SupabaseStatus';

export default function SettingsView() {
  const { integrations, updateIntegration, businessConfig, updateBusinessConfig } = useDashboard();
  const [activeTab, setActiveTab] = useState<'integrations' | 'voice-agent' | 'business'>('integrations');
  const [showPrompt, setShowPrompt] = useState(false);
  
  const [tempKeys, setTempKeys] = useState({
    vapi: integrations.vapi.apiKey,
    n8n: integrations.n8n.webhookUrl,
    googleCalendar: integrations.googleCalendar.apiKey,
    stripe: integrations.stripe.apiKey,
  });

  const [agentConfig, setAgentConfig] = useState({
    businessName: businessConfig.businessName || 'Your Business',
    businessService: businessConfig.serviceName || 'consultation',
    averageServicePrice: businessConfig.averageServicePrice || 100,
    businessHours: '9 AM - 5 PM, Monday - Friday',
    businessLocation: '123 Main Street, City, State',
    emergencyProtocol: 'Transfer to human staff immediately',
    faqList: [
      {
        question: 'What are your hours?',
        answer: 'We are open Monday through Friday, 9 AM to 5 PM.'
      },
      {
        question: 'Where are you located?',
        answer: 'We are located at 123 Main Street in downtown.'
      },
      {
        question: 'What are your prices?',
        answer: 'Our consultation starts at $100. We can discuss specific pricing during your appointment.'
      }
    ]
  });

  const handleSaveKey = (service: string, key: string) => {
    updateIntegration(service, { 
      apiKey: service === 'n8n' ? undefined : key,
      webhookUrl: service === 'n8n' ? key : undefined,
      connected: key.length > 0 
    });
  };

  const saveConfiguration = () => {
    updateBusinessConfig({
      businessName: agentConfig.businessName,
      serviceName: agentConfig.businessService,
      averageServicePrice: agentConfig.averageServicePrice
    });
    localStorage.setItem('voice-agent-config', JSON.stringify(agentConfig));
  };

  const generateVoicePrompt = () => {
    return `You are an AI receptionist voice agent. Your role is to act like a professional front desk assistant for ${agentConfig.businessName}.

Goals:
1. Answer inbound calls and make outbound calls in a friendly, professional tone.
2. Gather caller's name, phone number, email, and reason for calling.
3. Book, reschedule, or cancel appointments using the connected scheduling system.
4. Handle frequently asked questions about ${agentConfig.businessService} (hours, location, pricing, etc.).
5. If the caller's question is outside of scope, politely promise a callback and log the request.
6. Never overcomplicate — keep responses short, clear, and human-like.

Guidelines:
- Always confirm key details back to the caller (name, date, time).
- Route urgent matters (like emergencies) to human staff with a flagged message.
- If the caller is a new lead, highlight them in the CRM as "New Lead."
- If caller misses the call, trigger the auto follow-up SMS/email sequence.

Business Information:
- Business Name: ${agentConfig.businessName}
- Service Type: ${agentConfig.businessService}
- Hours: ${agentConfig.businessHours}
- Location: ${agentConfig.businessLocation}
- Average Service Price: $${agentConfig.averageServicePrice}
- Emergency Protocol: ${agentConfig.emergencyProtocol}

Frequently Asked Questions:
${agentConfig.faqList.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

Remember: Keep responses natural, professional, and focused on helping the caller achieve their goal efficiently.`;
  };

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(generateVoicePrompt());
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
      color: 'bg-blue-100 text-blue-600',
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
      color: 'bg-purple-100 text-purple-600',
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
      color: 'bg-green-100 text-green-600',
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
      color: 'bg-indigo-100 text-indigo-600',
      docs: 'https://stripe.com/docs'
    }
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Settings</h1>
            <p className="text-sm sm:text-base text-gray-600">Configure your AI receptionist integrations and business settings</p>
          </div>
          <div className="flex-shrink-0">
            <SupabaseStatus />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 sm:space-x-6 mb-4 sm:mb-6 lg:mb-8 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('integrations')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'integrations'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          } text-sm sm:text-base whitespace-nowrap`}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Key className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>API Integrations</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('voice-agent')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'voice-agent'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          } text-sm sm:text-base whitespace-nowrap`}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Voice Agent</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('business')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'business'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          } text-sm sm:text-base whitespace-nowrap`}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Business Config</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'integrations' && (
        <div className="space-y-4 sm:space-y-6">
          {integrationConfigs.map((config) => (
            <div key={config.id} className="card p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-base sm:text-lg ${config.color}`}>
                    {config.icon}
                  </div>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{config.name}</h3>
                      {config.status ? (
                        <span className="status-badge status-success">Connected</span>
                      ) : (
                        <span className="status-badge status-error">Not Connected</span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{config.description}</p>
                  </div>
                </div>
                <a
                  href={config.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  View Docs →
                </a>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {config.type}
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <input
                      type={config.id === 'n8n' ? 'url' : 'password'}
                      value={tempKeys[config.id as keyof typeof tempKeys]}
                      onChange={(e) => setTempKeys(prev => ({ ...prev, [config.id]: e.target.value }))}
                      placeholder={config.placeholder}
                      className="input-field flex-1 text-sm"
                    />
                    <button
                      onClick={() => handleSaveKey(config.id, tempKeys[config.id as keyof typeof tempKeys])}
                      className="btn-primary text-xs sm:text-sm px-3 py-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        webhookService.testConnection();
                        alert('Test webhook sent! Check your Railway logs.');
                      }}
                      className="btn-secondary text-xs sm:text-sm px-3 py-2"
                    >
                      Test
                    </button>
                  </div>
                </div>

                {config.id === 'vapi' && (
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-sm sm:text-base font-medium text-blue-900 mb-2">Vapi Integration</h4>
                    <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                      <li>• Handles all voice calls and AI conversations</li>
                      <li>• Integrates with your phone system for call routing</li>
                      <li>• Provides real-time transcription and call analytics</li>
                    </ul>
                  </div>
                )}
                {config.id === 'n8n' && (
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-sm sm:text-base font-medium text-purple-900 mb-2">n8n Workflow</h4>
                    <ul className="text-xs sm:text-sm text-purple-800 space-y-1">
                      <li>• Processes appointment bookings via Gemini AI workflow</li>
                      <li>• Syncs with Google Calendar automatically</li>
                      <li>• Handles follow-up SMS and email sequences</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'voice-agent' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Voice Agent Configuration */}
          <div className="card p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">AI Voice Agent Configuration</h2>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="btn-secondary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                >
                  {showPrompt ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                  <span>{showPrompt ? 'Hide' : 'Show'} Prompt</span>
                </button>
                <button
                  onClick={() => {
                    saveConfiguration();
                    alert('Voice agent configuration saved!');
                  }}
                  className="btn-primary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Save Config</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={agentConfig.businessName}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, businessName: e.target.value }))}
                  className="input-field text-sm"
                  placeholder="e.g., Bright Smile Dental"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <input
                  type="text"
                  value={agentConfig.businessService}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, businessService: e.target.value }))}
                  className="input-field text-sm"
                  placeholder="e.g., dental appointments"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={agentConfig.businessHours}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, businessHours: e.target.value }))}
                  className="input-field text-sm"
                  placeholder="e.g., 9 AM - 5 PM, Monday - Friday"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Average Service Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={agentConfig.averageServicePrice}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, averageServicePrice: parseInt(e.target.value) || 0 }))}
                    className="input-field pl-8 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Business Location
              </label>
              <input
                type="text"
                value={agentConfig.businessLocation}
                onChange={(e) => setAgentConfig(prev => ({ ...prev, businessLocation: e.target.value }))}
                className="input-field text-sm"
                placeholder="e.g., 123 Main Street, City, State"
              />
            </div>

            {/* Generated Prompt */}
            {showPrompt && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Generated Voice Agent Prompt</h3>
                  <button
                    onClick={copyPromptToClipboard}
                    className="btn-secondary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Copy Prompt</span>
                  </button>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border max-h-48 sm:max-h-64 overflow-y-auto">
                  <pre className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {generateVoicePrompt()}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Integration Instructions */}
          <div className="card p-3 sm:p-4 lg:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Integration Instructions</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <p>Copy the generated prompt above</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <p>Paste it into your Vapi assistant configuration</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <p>Connect your n8n workflow for appointment booking</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">4</span>
                <p>Test the voice agent with a sample call</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'business' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="card p-3 sm:p-4 lg:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Business Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  value={businessConfig.businessType}
                  onChange={(e) => updateBusinessConfig({ businessType: e.target.value })}
                  className="input-field text-sm"
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
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={businessConfig.serviceName}
                  onChange={(e) => updateBusinessConfig({ serviceName: e.target.value })}
                  placeholder="e.g., consultation, appointment, session"
                  className="input-field text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Average Service Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={businessConfig.averageServicePrice}
                    onChange={(e) => updateBusinessConfig({ averageServicePrice: parseInt(e.target.value) || 0 })}
                    className="input-field pl-8 text-sm"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={businessConfig.currency}
                  onChange={(e) => updateBusinessConfig({ currency: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm sm:text-base font-medium text-blue-900 mb-2">Business Configuration Preview</h4>
              <p className="text-xs sm:text-sm text-blue-800">
                Your AI receptionist will handle <strong>{businessConfig.serviceName}</strong> bookings for your{' '}
                <strong>{businessConfig.businessType.replace('-', ' ')}</strong> business, with an average service price of{' '}
                <strong>${businessConfig.averageServicePrice} {businessConfig.currency}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}