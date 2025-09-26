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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-full">
        {/* Mobile Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Agents</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your AI receptionist agents</p>
        </div>
        
        <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-8">
      {/* Agent List Sidebar */}
          <div className="lg:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 lg:p-6">
            <div className="mb-4 lg:mb-6 lg:hidden">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select Agent</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={`w-full p-3 sm:p-4 rounded-xl border text-left transition-all duration-200 ${
                selectedAgent === agent.id
                  ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{agent.name}</h3>
                  <span className={`status-badge ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">{agent.callsToday}</div>
                  <div className="text-gray-500 dark:text-gray-400">Calls</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">{agent.appointmentsToday}</div>
                  <div className="text-gray-500 dark:text-gray-400">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">{agent.followUpsToday}</div>
                  <div className="text-gray-500 dark:text-gray-400">Follow-ups</div>
                </div>
              </div>
            </button>
          ))}
            </div>
          </div>

      {/* Agent Details */}
          <div className="flex-1">
        {selectedAgentData && (
          <>
            {/* Agent Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{selectedAgentData.name}</h1>
                  <div className="flex items-center space-x-3">
                    <span className={`status-badge ${getStatusColor(selectedAgentData.status)}`}>
                      {selectedAgentData.status}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Agent Performance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedAgentData.callsToday}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Calls Today</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedAgentData.appointmentsToday}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Appointments Today</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedAgentData.followUpsToday}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Follow-ups Today</p>
              </div>
            </div>

            {/* Agent Activity Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Call Tracking */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Recent Calls</h2>
                <div className="space-y-3 sm:space-y-4">
                  {agentCalls.map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{call.caller}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{call.time} • {call.duration}</p>
                      </div>
                      <span className="status-badge status-success">{call.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointments */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Today's Appointments</h2>
                <div className="space-y-3 sm:space-y-4">
                  {agentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{appointment.client}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{appointment.time} • {appointment.service}</p>
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
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Active Follow-ups</h2>
                <div className="space-y-3 sm:space-y-4">
                  {agentFollowUps.map((followUp) => (
                    <div key={followUp.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{followUp.client}</p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
      </div>
    </div>
  );
}