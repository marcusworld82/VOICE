import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, CheckCircle, AlertCircle } from 'lucide-react';

interface Appointment {
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

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: '1',
      client: { name: 'Sarah Johnson', phone: '+1 (555) 123-4567', email: 'sarah@email.com' },
      service: 'Initial Consultation',
      datetime: '2025-01-16T10:00:00',
      duration: 60,
      status: 'confirmed',
      notes: 'First-time client, needs comprehensive evaluation'
    },
    {
      id: '2',
      client: { name: 'Mike Chen', phone: '+1 (555) 987-6543', email: 'mike@email.com' },
      service: 'Follow-up Session',
      datetime: '2025-01-16T14:30:00',
      duration: 30,
      status: 'scheduled'
    },
    {
      id: '3',
      client: { name: 'Emma Wilson', phone: '+1 (555) 456-7890', email: 'emma@email.com' },
      service: 'Premium Package',
      datetime: '2025-01-16T16:00:00',
      duration: 90,
      status: 'confirmed',
      notes: 'VIP client - ensure premium service'
    },
    {
      id: '4',
      client: { name: 'David Brown', phone: '+1 (555) 222-3333', email: 'david@email.com' },
      service: 'Consultation',
      datetime: '2025-01-17T09:00:00',
      duration: 45,
      status: 'scheduled'
    }
  ];

  const todayAppointments = appointments.filter(apt => 
    apt.datetime.startsWith(selectedDate)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'scheduled': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'completed': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'no-show': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Appointments</h2>
            <p className="text-gray-400 text-sm">Calendar & booking management</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* View Toggle & Date Picker */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {['day', 'week', 'month'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as 'day' | 'week' | 'month')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-blue-400">{todayAppointments.length}</div>
          <div className="text-xs text-gray-400">Today</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-green-400">
            {todayAppointments.filter(a => a.status === 'confirmed').length}
          </div>
          <div className="text-xs text-gray-400">Confirmed</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-purple-400">
            {appointments.filter(a => a.status === 'completed').length}
          </div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-yellow-400">24</div>
          <div className="text-xs text-gray-400">This Week</div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {todayAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium">{appointment.client.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(appointment.datetime)} ({appointment.duration}min)</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">{appointment.service}</div>
                  {appointment.notes && (
                    <div className="text-xs text-gray-400 mt-1 italic">{appointment.notes}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors">
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors">
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Google Calendar Integration Status */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Google Calendar Synced</span>
        </div>
        <p className="text-gray-300 text-xs mt-1">Auto-sync enabled via n8n workflow</p>
      </div>
    </div>
  );
}