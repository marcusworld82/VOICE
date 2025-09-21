import React, { useState } from 'react';
import { Mic, Settings, Save, Copy, Eye, EyeOff } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function VoiceAgentConfig() {
  const { businessConfig, updateBusinessConfig } = useDashboard();
  const [showPrompt, setShowPrompt] = useState(false);
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
    // You could add a toast notification here
  };

  const saveConfiguration = () => {
    updateBusinessConfig({
      businessName: agentConfig.businessName,
      serviceName: agentConfig.businessService,
      averageServicePrice: agentConfig.averageServicePrice
    });
    // Save to localStorage or API
    localStorage.setItem('voice-agent-config', JSON.stringify(agentConfig));
  };

  const addFAQ = () => {
    setAgentConfig(prev => ({
      ...prev,
      faqList: [...prev.faqList, { question: '', answer: '' }]
    }));
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    setAgentConfig(prev => ({
      ...prev,
      faqList: prev.faqList.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const removeFAQ = (index: number) => {
    setAgentConfig(prev => ({
      ...prev,
      faqList: prev.faqList.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Voice Agent</h2>
            <p className="text-gray-400 text-sm">Configure your AI receptionist</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
          >
            {showPrompt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPrompt ? 'Hide' : 'Show'} Prompt</span>
          </button>
          <button
            onClick={saveConfiguration}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Config</span>
          </button>
        </div>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto">
        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold">Business Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={agentConfig.businessName}
                onChange={(e) => setAgentConfig(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                placeholder="e.g., Bright Smile Dental"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Service Type
              </label>
              <input
                type="text"
                value={agentConfig.businessService}
                onChange={(e) => setAgentConfig(prev => ({ ...prev, businessService: e.target.value }))}
                className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                placeholder="e.g., dental appointments"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Hours
              </label>
              <input
                type="text"
                value={agentConfig.businessHours}
                onChange={(e) => setAgentConfig(prev => ({ ...prev, businessHours: e.target.value }))}
                className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                placeholder="e.g., 9 AM - 5 PM, Monday - Friday"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Average Service Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={agentConfig.averageServicePrice}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, averageServicePrice: parseInt(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Business Location
            </label>
            <input
              type="text"
              value={agentConfig.businessLocation}
              onChange={(e) => setAgentConfig(prev => ({ ...prev, businessLocation: e.target.value }))}
              className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              placeholder="e.g., 123 Main Street, City, State"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Emergency Protocol
            </label>
            <input
              type="text"
              value={agentConfig.emergencyProtocol}
              onChange={(e) => setAgentConfig(prev => ({ ...prev, emergencyProtocol: e.target.value }))}
              className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              placeholder="e.g., Transfer to human staff immediately"
            />
          </div>
        </div>

        {/* FAQ Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Frequently Asked Questions</h3>
            <button
              onClick={addFAQ}
              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm"
            >
              Add FAQ
            </button>
          </div>
          
          <div className="space-y-3">
            {agentConfig.faqList.map((faq, index) => (
              <div key={index} className="p-4 bg-black/30 rounded-xl border border-gray-700">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20"
                      placeholder="e.g., What are your hours?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Answer
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 resize-none"
                      rows={2}
                      placeholder="e.g., We are open Monday through Friday, 9 AM to 5 PM."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeFAQ(index)}
                      className="px-2 py-1 text-red-400 hover:bg-red-500/10 rounded text-xs transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Prompt */}
        {showPrompt && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Generated Voice Agent Prompt</h3>
              <button
                onClick={copyPromptToClipboard}
                className="flex items-center space-x-2 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-lg border border-gray-500/30 hover:bg-gray-500/30 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-gray-600 max-h-64 overflow-y-auto">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                {generateVoicePrompt()}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Integration Instructions */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
        <h4 className="text-blue-400 font-medium mb-2">Integration Instructions</h4>
        <div className="text-gray-300 text-sm space-y-1">
          <p>1. Copy the generated prompt above</p>
          <p>2. Paste it into your Vapi assistant configuration</p>
          <p>3. Connect your n8n workflow for appointment booking</p>
          <p>4. Test the voice agent with a sample call</p>
        </div>
      </div>
    </div>
  );
}