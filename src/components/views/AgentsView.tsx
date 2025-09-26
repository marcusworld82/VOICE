import React, { useState } from 'react';
import { User, Phone, Calendar, Clock, MessageSquare, TrendingUp } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  callsToday: number;
  appointmentsToday: number;
  followUpsToday: number;
  avatar?: string;
}

export default function AgentsView() {
  const [selectedAgent, setSelectedAgent] = useState<string>('sarah');

  // Mock agents data
  const agents: Agent[] = [
    {
      id: 'sarah',
      name: 'Sarah Johnson',
      status: 'online',
      callsToday: 12,
      appointmentsToday: 8,
      followUpsToday: 3
    },
    {
      id: 'mike',
      name: 'Mike Chen',
      status: 'busy',
      callsToday: 9,
      appointmentsToday: 6,
      followUpsToday: 2
    },
    {
      id: 'jennifer',
      name: 'Jennifer Martinez',
      status: 'offline',
      callsToday: 0,
      appointmentsToday: 0,
      followUpsToday: 1
    }
  ];

  const selectedAgentData = agents.find(agent => agent.id === selectedAgent);

  // Mock agent-specific data
  const agentCalls = [
    { id: 1, caller: 'John Smith', time: '10:30 AM', duration: '4:32', status: 'completed' },
    { id: 2, caller: 'Lisa Wilson', time: '9:45 AM', duration: '2:15', status: 'completed' },
    { id: 3, caller: 'Robert Brown', time: '9:15 AM', duration: '6:18', status: 'completed' },
  ];

  const agentAppointments = [
    { id: 1, client: 'Emma Davis', time: '2:00 PM', service: 'Consultation', status: 'confirmed' },
    { id: 2, client: 'Tom Wilson', time: '3:30 PM', service: 'Follow-up', status: 'pending' },
    { id: 3, client: 'Anna Johnson', time: '4:00 PM', service: 'Initial Meeting', status: 'confirmed' },
  ];

  const agentFollowUps = [
    { id: 1, client: 'Mark Thompson', type: 'missed-call', hours: 2, status: 'pending' },
    { id: 2, client: 'Sarah Lee', type: 'no-booking', hours: 24, status: 'sent' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-full">
      {/* Agent List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agents</h1>
          <p className="text-gray-600">Manage your AI receptionist agents</p>
        </div>

        <div className="space-y-3">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                selectedAgent === agent.id
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{agent.name}</h3>
                  <span className={`status-badge ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-gray-900">{agent.callsToday}</div>
                  <div className="text-gray-500">Calls</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{agent.appointmentsToday}</div>
                  <div className="text-gray-500">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{agent.followUpsToday}</div>
                  <div className="text-gray-500">Follow-ups</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Agent Details */}
      <div className="flex-1 p-8">
        {selectedAgentData && (
          <>
            {/* Agent Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{selectedAgentData.name}</h1>
                  <div className="flex items-center space-x-3">
                    <span className={`status-badge ${getStatusColor(selectedAgentData.status)}`}>
                      {selectedAgentData.status}
                    </span>
                    <span className="text-gray-500">Agent Performance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="metric-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedAgentData.callsToday}</h3>
                <p className="text-sm text-gray-600">Calls Today</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedAgentData.appointmentsToday}</h3>
                <p className="text-sm text-gray-600">Appointments Today</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedAgentData.followUpsToday}</h3>
                <p className="text-sm text-gray-600">Follow-ups Today</p>
              </div>
            </div>

            {/* Agent Activity Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Call Tracking */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Calls</h2>
                <div className="space-y-4">
                  {agentCalls.map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{call.caller}</p>
                        <p className="text-sm text-gray-500">{call.time} • {call.duration}</p>
                      </div>
                      <span className="status-badge status-success">{call.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointments */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h2>
                <div className="space-y-4">
                  {agentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.client}</p>
                        <p className="text-sm text-gray-500">{appointment.time} • {appointment.service}</p>
                      </div>
                      <span className={`status-badge ${
                        appointment.status === 'confirmed' ? 'status-success' : 'status-warning'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-ups */}
              <div className="card p-6 lg:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Follow-ups</h2>
                <div className="space-y-4">
                  {agentFollowUps.map((followUp) => (
                    <div key={followUp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{followUp.client}</p>
                          <p className="text-sm text-gray-500">
                            {followUp.type.replace('-', ' ')} • {followUp.hours}h ago
                          </p>
                        </div>
                      </div>
                      <span className={`status-badge ${
                        followUp.status === 'sent' ? 'status-info' : 'status-warning'
                      }`}>
                        {followUp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}