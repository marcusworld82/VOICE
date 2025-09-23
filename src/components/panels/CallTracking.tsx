import React, { useState } from 'react';
import { Phone, PhoneCall, Clock, User, FileText, Play, Pause } from 'lucide-react';
import { webhookService } from '../../services/webhookService';

interface Call {
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

export default function CallTracking() {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [playingRecording, setPlayingRecording] = useState<string | null>(null);

  // Send webhook for call events when they occur
  React.useEffect(() => {
    // Simulate sending webhook for completed calls
    const completedCalls = calls.filter(call => call.status === 'completed');
    completedCalls.forEach(call => {
      // In a real app, this would be triggered when the call actually completes
      // For demo purposes, we're just showing how it would work
    });

    // Simulate sending webhook for missed calls
    const missedCalls = calls.filter(call => call.status === 'missed');
    missedCalls.forEach(call => {
      // webhookService.sendCallMissed(call);
    });
  }, []);

  // Mock call data
  const calls: Call[] = [
    {
      id: '1',
      type: 'inbound',
      caller: { name: 'Sarah Johnson', phone: '+1 (555) 123-4567' },
      duration: '4:32',
      status: 'completed',
      timestamp: '2025-01-16 10:30 AM',
      transcript: 'Hi, I\'d like to schedule an appointment for next week. I\'m looking for a consultation about...',
      recording: 'call-recording-1.mp3'
    },
    {
      id: '2',
      type: 'inbound',
      caller: { name: 'Mike Chen', phone: '+1 (555) 987-6543' },
      duration: '2:15',
      status: 'missed',
      timestamp: '2025-01-16 09:45 AM',
      transcript: null,
      recording: null
    },
    {
      id: '3',
      type: 'outbound',
      caller: { name: 'Emma Wilson', phone: '+1 (555) 456-7890' },
      duration: '6:18',
      status: 'completed',
      timestamp: '2025-01-16 09:15 AM',
      transcript: 'Hello Emma, this is a follow-up call regarding your appointment. We wanted to confirm...',
      recording: 'call-recording-3.mp3'
    },
    {
      id: '4',
      type: 'inbound',
      caller: { name: 'Unknown', phone: '+1 (555) 111-2222' },
      duration: '0:45',
      status: 'ongoing',
      timestamp: '2025-01-16 11:00 AM',
      transcript: 'Call in progress...',
      recording: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'missed': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'ongoing': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const toggleRecording = (callId: string) => {
    if (playingRecording === callId) {
      setPlayingRecording(null);
    } else {
      setPlayingRecording(callId);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Call Tracking</h2>
            <p className="text-gray-400 text-sm">Real-time call monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20">
            {calls.length} Calls Today
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-2xl font-bold text-green-400">{calls.filter(c => c.status === 'completed').length}</div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-2xl font-bold text-red-400">{calls.filter(c => c.status === 'missed').length}</div>
          <div className="text-xs text-gray-400">Missed</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-2xl font-bold text-yellow-400">{calls.filter(c => c.status === 'ongoing').length}</div>
          <div className="text-xs text-gray-400">Ongoing</div>
        </div>
      </div>

      {/* Call List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {calls.map((call) => (
          <div
            key={call.id}
            className="p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
            onClick={() => setSelectedCall(call)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  call.type === 'inbound' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {call.type === 'inbound' ? (
                    <PhoneCall className="w-4 h-4" />
                  ) : (
                    <Phone className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{call.caller.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{call.caller.phone}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{call.duration}</span>
                    </div>
                    <span>{call.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {call.recording && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRecording(call.id);
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {playingRecording === call.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                )}
                {call.transcript && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCall(call);
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {call.transcript && selectedCall?.id === call.id && (
              <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm font-medium">Transcript</span>
                </div>
                <p className="text-gray-300 text-sm">{call.transcript}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}