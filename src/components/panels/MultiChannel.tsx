import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, User, Filter } from 'lucide-react';

interface Communication {
  id: string;
  client: {
    name: string;
    phone: string;
    email: string;
  };
  type: 'call' | 'sms' | 'email';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export default function MultiChannel() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Mock communication data
  const communications: Communication[] = [
    {
      id: '1',
      client: { name: 'Sarah Johnson', phone: '+1 (555) 123-4567', email: 'sarah@email.com' },
      type: 'call',
      direction: 'inbound',
      content: 'Appointment booking call - 4:32 duration',
      timestamp: '2025-01-16 10:30 AM',
      status: 'delivered'
    },
    {
      id: '2',
      client: { name: 'Sarah Johnson', phone: '+1 (555) 123-4567', email: 'sarah@email.com' },
      type: 'sms',
      direction: 'outbound',
      content: 'Hi Sarah, this is a confirmation for your appointment tomorrow at 2 PM. Reply CONFIRM to confirm.',
      timestamp: '2025-01-16 10:35 AM',
      status: 'read'
    },
    {
      id: '3',
      client: { name: 'Sarah Johnson', phone: '+1 (555) 123-4567', email: 'sarah@email.com' },
      type: 'sms',
      direction: 'inbound',
      content: 'CONFIRM - Thank you!',
      timestamp: '2025-01-16 10:45 AM',
      status: 'delivered'
    },
    {
      id: '4',
      client: { name: 'Mike Chen', phone: '+1 (555) 987-6543', email: 'mike@email.com' },
      type: 'email',
      direction: 'outbound',
      content: 'Welcome email with service information and preparation instructions',
      timestamp: '2025-01-16 09:15 AM',
      status: 'read'
    },
    {
      id: '5',
      client: { name: 'Mike Chen', phone: '+1 (555) 987-6543', email: 'mike@email.com' },
      type: 'call',
      direction: 'inbound',
      content: 'Follow-up call - 2:15 duration',
      timestamp: '2025-01-16 09:45 AM',
      status: 'delivered'
    },
    {
      id: '6',
      client: { name: 'Emma Wilson', phone: '+1 (555) 456-7890', email: 'emma@email.com' },
      type: 'sms',
      direction: 'outbound',
      content: 'Reminder: Your appointment is in 1 hour. Address: 123 Main St. See you soon!',
      timestamp: '2025-01-16 08:00 AM',
      status: 'read'
    },
    {
      id: '7',
      client: { name: 'David Brown', phone: '+1 (555) 222-3333', email: 'david@email.com' },
      type: 'call',
      direction: 'inbound',
      content: 'Missed call - No voicemail',
      timestamp: '2025-01-15 4:20 PM',
      status: 'failed'
    },
    {
      id: '8',
      client: { name: 'David Brown', phone: '+1 (555) 222-3333', email: 'david@email.com' },
      type: 'sms',
      direction: 'outbound',
      content: 'Hi David, I see you called earlier. How can I help you today? Please call back or reply to schedule.',
      timestamp: '2025-01-15 4:25 PM',
      status: 'delivered'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Communications', count: communications.length },
    { id: 'call', label: 'Calls', count: communications.filter(c => c.type === 'call').length },
    { id: 'sms', label: 'SMS', count: communications.filter(c => c.type === 'sms').length },
    { id: 'email', label: 'Email', count: communications.filter(c => c.type === 'email').length },
  ];

  const filteredCommunications = selectedFilter === 'all' 
    ? communications 
    : communications.filter(c => c.type === selectedFilter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'sms': return <MessageCircle className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'from-blue-500 to-blue-600';
      case 'sms': return 'from-green-500 to-green-600';
      case 'email': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'delivered': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'read': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const groupedByClient = communications.reduce((groups, comm) => {
    const client = comm.client.name;
    if (!groups[client]) {
      groups[client] = [];
    }
    groups[client].push(comm);
    return groups;
  }, {} as Record<string, Communication[]>);

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Multi-Channel Log</h2>
            <p className="text-gray-400 text-sm">Unified communication timeline</p>
          </div>
        </div>
        <button className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedFilter === filter.id
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <span>{filter.label}</span>
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">{filter.count}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-blue-400">{Object.keys(groupedByClient).length}</div>
          <div className="text-xs text-gray-400">Active Clients</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-green-400">{communications.filter(c => c.type === 'sms').length}</div>
          <div className="text-xs text-gray-400">SMS Sent</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-purple-400">{communications.filter(c => c.type === 'email').length}</div>
          <div className="text-xs text-gray-400">Emails</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-yellow-400">
            {communications.filter(c => c.status === 'read' || c.status === 'delivered').length}
          </div>
          <div className="text-xs text-gray-400">Delivered</div>
        </div>
      </div>

      {/* Communication Timeline */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredCommunications.map((comm, index) => (
          <div
            key={comm.id}
            className={`p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors ${
              selectedClient === comm.client.name ? 'ring-2 ring-indigo-500/50' : ''
            }`}
            onClick={() => setSelectedClient(selectedClient === comm.client.name ? null : comm.client.name)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 bg-gradient-to-r ${getTypeColor(comm.type)} rounded-full flex items-center justify-center text-white`}>
                {getTypeIcon(comm.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{comm.client.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      comm.direction === 'inbound' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                    }`}>
                      {comm.direction}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(comm.status)}`}>
                      {comm.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{comm.timestamp}</span>
                  </div>
                </div>

                <div className="text-gray-300 text-sm mb-2">
                  {comm.content.length > 100 ? `${comm.content.substring(0, 100)}...` : comm.content}
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{comm.client.phone}</span>
                  </div>
                  {comm.client.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{comm.client.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Client Timeline Preview */}
            {selectedClient === comm.client.name && (
              <div className="mt-4 pl-11 border-l-2 border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Communication History:</div>
                {groupedByClient[comm.client.name].slice(0, 3).map((historyComm, historyIndex) => (
                  <div key={historyIndex} className="flex items-center space-x-2 py-1 text-xs">
                    <div className={`w-4 h-4 bg-gradient-to-r ${getTypeColor(historyComm.type)} rounded-full flex items-center justify-center`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-gray-300">{historyComm.type.toUpperCase()}</span>
                    <span className="text-gray-400">{historyComm.timestamp}</span>
                    <span className={`px-1 py-0.5 rounded text-xs ${getStatusColor(historyComm.status).replace('border-', 'border ')}`}>
                      {historyComm.status}
                    </span>
                  </div>
                ))}
                {groupedByClient[comm.client.name].length > 3 && (
                  <div className="text-xs text-gray-500 mt-1">
                    +{groupedByClient[comm.client.name].length - 3} more communications
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}