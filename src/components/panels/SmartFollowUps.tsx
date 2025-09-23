import React, { useState } from 'react';
import { Clock, Bell, Users, Settings, Play, Pause } from 'lucide-react';
import { webhookService } from '../../services/webhookService';

interface FollowUp {
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

export default function SmartFollowUps() {
  const [autoFollowUpEnabled, setAutoFollowUpEnabled] = useState(true);
  const [followUpDelay, setFollowUpDelay] = useState(24);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Mock follow-up data
  const followUps: FollowUp[] = [
    {
      id: '1',
      client: 'Jennifer Martinez',
      phone: '+1 (555) 789-0123',
      email: 'jennifer@email.com',
      lastContact: '2025-01-15 2:30 PM',
      hoursElapsed: 21,
      status: 'pending',
      type: 'no-booking',
      nextAction: 'Send booking reminder SMS'
    },
    {
      id: '2',
      client: 'Robert Chen',
      phone: '+1 (555) 333-7777',
      email: 'robert@email.com',
      lastContact: '2025-01-15 11:00 AM',
      hoursElapsed: 26,
      status: 'sent',
      type: 'no-booking',
      nextAction: 'Follow-up email sent'
    },
    {
      id: '3',
      client: 'Unknown Caller',
      phone: '+1 (555) 444-5555',
      email: '',
      lastContact: '2025-01-15 9:45 AM',
      hoursElapsed: 27,
      status: 'pending',
      type: 'missed-appointment',
      nextAction: 'Send missed call SMS'
    },
    {
      id: '4',
      client: 'Lisa Williams',
      phone: '+1 (555) 666-8888',
      email: 'lisa@email.com',
      lastContact: '2025-01-14 4:20 PM',
      hoursElapsed: 43,
      status: 'responded',
      type: 'follow-up-call',
      nextAction: 'Client responded - appointment booked'
    }
  ];

  const filteredFollowUps = selectedType === 'all' 
    ? followUps 
    : followUps.filter(f => f.type === selectedType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'sent': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'responded': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'no-booking': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'missed-appointment': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'follow-up-call': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const triggerFollowUp = (followUpId: string) => {
    console.log(`Triggering follow-up for ${followUpId}`);
    
    // Find the follow-up data and send webhook
    const followUp = followUps.find(f => f.id === followUpId);
    if (followUp) {
      webhookService.sendFollowUpTriggered(followUp);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Smart Follow-Ups</h2>
            <p className="text-gray-400 text-sm">Automated reminder system</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Auto Follow-Up</span>
            <button
              onClick={() => setAutoFollowUpEnabled(!autoFollowUpEnabled)}
              className={`w-10 h-6 rounded-full transition-colors ${
                autoFollowUpEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                autoFollowUpEnabled ? 'translate-x-5' : 'translate-x-1'
              }`} style={{ marginTop: '2px' }} />
            </button>
          </div>
          <button className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-6 p-4 bg-black/30 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Auto Follow-Up Settings</h3>
            <p className="text-gray-400 text-sm">Send follow-ups after specified hours without booking</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-gray-400 text-sm">Delay:</label>
              <select
                value={followUpDelay}
                onChange={(e) => setFollowUpDelay(parseInt(e.target.value))}
                className="px-3 py-1 bg-black/30 border border-gray-600 rounded text-white text-sm focus:border-purple-400"
              >
                <option value={2}>2 hours</option>
                <option value={6}>6 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>72 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mb-6">
        {[
          { id: 'all', label: 'All', count: followUps.length },
          { id: 'no-booking', label: 'No Booking', count: followUps.filter(f => f.type === 'no-booking').length },
          { id: 'missed-appointment', label: 'Missed', count: followUps.filter(f => f.type === 'missed-appointment').length },
          { id: 'follow-up-call', label: 'Follow-up', count: followUps.filter(f => f.type === 'follow-up-call').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === tab.id
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <span>{tab.label}</span>
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-yellow-400">{followUps.filter(f => f.status === 'pending').length}</div>
          <div className="text-xs text-gray-400">Pending</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-blue-400">{followUps.filter(f => f.status === 'sent').length}</div>
          <div className="text-xs text-gray-400">Sent</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-green-400">{followUps.filter(f => f.status === 'responded').length}</div>
          <div className="text-xs text-gray-400">Responded</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-purple-400">
            {followUps.filter(f => f.hoursElapsed >= followUpDelay && f.status === 'pending').length}
          </div>
          <div className="text-xs text-gray-400">Ready to Send</div>
        </div>
      </div>

      {/* Follow-Up List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {filteredFollowUps.map((followUp) => (
          <div
            key={followUp.id}
            className="p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-white font-medium">{followUp.client}</span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(followUp.status)}`}>
                    {followUp.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(followUp.type)}`}>
                    {followUp.type.replace('-', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-2">
                  <div>
                    <span className="font-medium">Phone:</span> {followUp.phone}
                  </div>
                  {followUp.email && (
                    <div>
                      <span className="font-medium">Email:</span> {followUp.email}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Last Contact:</span> {followUp.lastContact}
                  </div>
                  <div>
                    <span className="font-medium">Hours Elapsed:</span> {followUp.hoursElapsed}h
                  </div>
                </div>

                <div className="text-sm text-gray-300 mb-3">{followUp.nextAction}</div>

                {followUp.hoursElapsed >= followUpDelay && followUp.status === 'pending' && (
                  <div className="flex items-center space-x-2 text-xs">
                    <Bell className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400">Ready for follow-up</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex items-center space-x-2">
                {followUp.status === 'pending' && (
                  <button
                    onClick={() => triggerFollowUp(followUp.id)}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auto Follow-Up Status */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${autoFollowUpEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className={`text-sm font-medium ${autoFollowUpEnabled ? 'text-green-400' : 'text-gray-400'}`}>
            Auto Follow-Up {autoFollowUpEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <p className="text-gray-300 text-xs mt-1">
          {autoFollowUpEnabled 
            ? `Automatically sending follow-ups after ${followUpDelay} hours of no booking activity`
            : 'Manual follow-up mode - click Send buttons to trigger follow-ups'
          }
        </p>
      </div>
    </div>
  );
}