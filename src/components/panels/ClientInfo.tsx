import React, { useState } from 'react';
import { Users, Search, Download, Plus, Phone, Mail, Tag } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'prospect';
  tags: string[];
  totalAppointments: number;
  totalSpent: number;
  lastContact: string;
  notes: string;
}

export default function ClientInfo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Mock client data
  const clients: Client[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah@email.com',
      status: 'active',
      tags: ['VIP', 'High Value', 'Regular'],
      totalAppointments: 12,
      totalSpent: 2400,
      lastContact: '2025-01-16',
      notes: 'Prefers morning appointments. Very satisfied with service.'
    },
    {
      id: '2',
      name: 'Mike Chen',
      phone: '+1 (555) 987-6543',
      email: 'mike@email.com',
      status: 'active',
      tags: ['New Client'],
      totalAppointments: 2,
      totalSpent: 300,
      lastContact: '2025-01-15',
      notes: 'Recent referral from Sarah Johnson.'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      phone: '+1 (555) 456-7890',
      email: 'emma@email.com',
      status: 'active',
      tags: ['VIP', 'Premium Package'],
      totalAppointments: 8,
      totalSpent: 1600,
      lastContact: '2025-01-14',
      notes: 'Premium package client. Excellent feedback.'
    },
    {
      id: '4',
      name: 'David Brown',
      phone: '+1 (555) 222-3333',
      email: 'david@email.com',
      status: 'prospect',
      tags: ['Hot Lead'],
      totalAppointments: 0,
      totalSpent: 0,
      lastContact: '2025-01-13',
      notes: 'Interested in premium services. Follow up scheduled.'
    }
  ];

  const allTags = ['all', ...Array.from(new Set(clients.flatMap(client => client.tags)))];
  
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesTag = selectedTag === 'all' || client.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'inactive': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      case 'prospect': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Phone', 'Email', 'Status', 'Tags', 'Total Appointments', 'Total Spent', 'Last Contact'],
      ...filteredClients.map(client => [
        client.name,
        client.phone,
        client.email,
        client.status,
        client.tags.join('; '),
        client.totalAppointments.toString(),
        `$${client.totalSpent}`,
        client.lastContact
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Client Information</h2>
            <p className="text-gray-400 text-sm">CRM & client management</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
          />
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
        >
          {allTags.map(tag => (
            <option key={tag} value={tag} className="bg-gray-800">
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-green-400">{clients.filter(c => c.status === 'active').length}</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-blue-400">{clients.filter(c => c.status === 'prospect').length}</div>
          <div className="text-xs text-gray-400">Prospects</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-yellow-400">
            ${clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Total Revenue</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-purple-400">{clients.length}</div>
          <div className="text-xs text-gray-400">Total Clients</div>
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-white font-medium">{client.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{client.email}</span>
                  </div>
                </div>

                {client.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="w-3 h-3 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {client.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs border border-blue-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
                  <div>
                    <span className="font-medium">Appointments:</span>
                    <div className="text-white">{client.totalAppointments}</div>
                  </div>
                  <div>
                    <span className="font-medium">Total Spent:</span>
                    <div className="text-green-400">${client.totalSpent.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="font-medium">Last Contact:</span>
                    <div className="text-white">{new Date(client.lastContact).toLocaleDateString()}</div>
                  </div>
                </div>

                {client.notes && (
                  <div className="mt-2 text-xs text-gray-300 italic">
                    {client.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}