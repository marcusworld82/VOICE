import React, { useState } from 'react';
import { PhoneMissed, Send, MessageSquare, Clock, User } from 'lucide-react';

interface MissedCall {
  id: string;
  caller: {
    name: string;
    phone: string;
  };
  timestamp: string;
  attempts: number;
  followUpSent: boolean;
  voicemail: {
    duration: string;
    transcript: string;
  } | null;
}

export default function MissedCalls() {
  const [selectedCall, setSelectedCall] = useState<string | null>(null);

  // Mock missed calls data
  const missedCalls: MissedCall[] = [
    {
      id: '1',
      caller: { name: 'Jennifer Martinez', phone: '+1 (555) 789-0123' },
      timestamp: '2025-01-16 11:30 AM',
      attempts: 2,
      followUpSent: false,
      voicemail: {
        duration: '1:45',
        transcript: 'Hi, this is Jennifer. I was hoping to schedule an appointment for next week. Could you please call me back? Thanks.'
      }
    },
    {
      id: '2',
      caller: { name: 'Unknown', phone: '+1 (555) 444-5555' },
      timestamp: '2025-01-16 10:15 AM',
      attempts: 1,
      followUpSent: true,
      voicemail: null
    },
    {
      id: '3',
      caller: { name: 'Robert Chen', phone: '+1 (555) 333-7777' },
      timestamp: '2025-01-16 09:45 AM',
      attempts: 3,
      followUpSent: false,
      voicemail: {
        duration: '0:32',
        transcript: 'Hey, I missed your call. Can we reschedule my appointment? Please let me know. Thank you.'
      }
    },
    {
      id: '4',
      caller: { name: 'Lisa Williams', phone: '+1 (555) 666-8888' },
      timestamp: '2025-01-15 4:20 PM',
      attempts: 1,
      followUpSent: true,
      voicemail: null
    }
  ];

  const sendFollowUp = (callId: string, type: 'sms' | 'email') => {
    console.log(`Sending ${type} follow-up for call ${callId}`);
    // In real implementation, this would trigger the n8n workflow
  };

  const configureAutoFollowUp = () => {
    console.log('Opening auto-follow-up configuration');
    // This would open a modal or navigate to settings
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <PhoneMissed className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Missed Calls & Voicemail</h2>
            <p className="text-gray-400 text-sm">Auto follow-up management</p>
          </div>
        </div>
        <button
          onClick={configureAutoFollowUp}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Auto Follow-Up</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-2xl font-bold text-red-400">{missedCalls.length}</div>
          <div className="text-xs text-gray-400">Missed Today</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-2xl font-bold text-blue-400">{missedCalls.filter(c => c.voicemail).length}</div>
          <div className="text-xs text-gray-400">Voicemails</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-2xl font-bold text-green-400">{missedCalls.filter(c => c.followUpSent).length}</div>
          <div className="text-xs text-gray-400">Followed Up</div>
        </div>
      </div>

      {/* Missed Calls List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {missedCalls.map((call) => (
          <div
            key={call.id}
            className="p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  {call.caller.name !== 'Unknown' ? (
                    <User className="w-4 h-4 text-red-400" />
                  ) : (
                    <PhoneMissed className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium">{call.caller.name}</span>
                    {call.attempts > 1 && (
                      <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs border border-orange-500/20">
                        {call.attempts} attempts
                      </span>
                    )}
                    {call.followUpSent && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs border border-green-500/20">
                        Follow-up sent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <span>{call.caller.phone}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{call.timestamp}</span>
                    </div>
                  </div>

                  {call.voicemail && (
                    <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">
                          Voicemail ({call.voicemail.duration})
                        </span>
                      </div>
                      {selectedCall === call.id ? (
                        <p className="text-gray-300 text-sm">{call.voicemail.transcript}</p>
                      ) : (
                        <button
                          onClick={() => setSelectedCall(call.id)}
                          className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                        >
                          Click to view transcript
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {!call.followUpSent && (
                  <>
                    <button
                      onClick={() => sendFollowUp(call.id, 'sms')}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Send SMS"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => sendFollowUp(call.id, 'email')}
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Send Email"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auto Follow-Up Configuration */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-blue-400 font-medium">Auto Follow-Up Settings</h4>
            <p className="text-gray-300 text-sm">Send automatic SMS/email after missed calls</p>
          </div>
          <button
            onClick={configureAutoFollowUp}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
          >
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}