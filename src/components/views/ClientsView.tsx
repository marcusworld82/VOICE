import React, { useState } from 'react';
import { Users, Search, Download, Plus, Phone, Mail, Tag, Filter, Eye } from 'lucide-react';
import { webhookService } from '../../services/webhookService';

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

export default function ClientsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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
    },
    {
      id: '5',
      name: 'Lisa Martinez',
      phone: '+1 (555) 333-4444',
      email: 'lisa@email.com',
      status: 'active',
      tags: ['Regular', 'Referral Source'],
      totalAppointments: 6,
      totalSpent: 900,
      lastContact: '2025-01-12',
      notes: 'Has referred 3 new clients. Excellent relationship.'
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
      case 'active': return 'status-success';
      case 'inactive': return 'status-error';
      case 'prospect': return 'status-info';
      default: return 'status-info';
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
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
          <p className="text-gray-600">Manage your client relationships and CRM data</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => window.location.href = '/integrations'}
            className="btn-secondary flex items-center space-x-2"
          >
            <span>Integrations</span>
          </button>
          <button 
            onClick={() => {
              try {
                // In a real app, this would open a modal or form
                // For now, we'll simulate creating a client
                const newClient = {
                  id: Date.now().toString(),
                  name: 'New Client',
                  phone: '+1 (555) 000-0000',
                  email: 'newclient@email.com',
                  status: 'prospect' as const,
                  tags: ['New Lead'],
                  totalAppointments: 0,
                  totalSpent: 0,
                  lastContact: new Date().toISOString().split('T')[0],
                  notes: 'New client added from dashboard'
                };
                webhookService.sendClientCreated(newClient);
              } catch (error) {
                console.error('Failed to create client:', error);
              }
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{clients.filter(c => c.status === 'active').length}</h3>
          <p className="text-sm text-gray-600">Active Clients</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{clients.filter(c => c.status === 'prospect').length}</h3>
          <p className="text-sm text-gray-600">Prospects</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ${clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{clients.length}</h3>
          <p className="text-sm text-gray-600">Total Clients</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="input-field w-48"
          >
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag === 'all' ? 'All Tags' : tag}
              </option>
            ))}
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="card-hover p-6 cursor-pointer"
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-medium text-gray-600">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <span className={`status-badge ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{client.email}</span>
                      </div>
                    </div>

                    {client.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {client.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Appointments:</span>
                        <div className="font-medium text-gray-900">{client.totalAppointments}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Spent:</span>
                        <div className="font-medium text-green-600">${client.totalSpent.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Contact:</span>
                        <div className="font-medium text-gray-900">{new Date(client.lastContact).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Details Panel */}
        <div className="lg:col-span-1">
          {selectedClient ? (
            <div className="card p-6 sticky top-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-medium text-gray-600">
                    {selectedClient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedClient.name}</h3>
                  <span className={`status-badge ${getStatusColor(selectedClient.status)}`}>
                    {selectedClient.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Information</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedClient.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Client Metrics</label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{selectedClient.totalAppointments}</div>
                      <div className="text-xs text-gray-500">Appointments</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">${selectedClient.totalSpent}</div>
                      <div className="text-xs text-gray-500">Total Spent</div>
                    </div>
                  </div>
                </div>

                {selectedClient.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tags</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedClient.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedClient.notes}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => {
                    console.log('Schedule Appointment clicked for:', selectedClient.name);
                    const newAppointment = {
                      id: Date.now().toString(),
                      client: {
                        name: selectedClient.name,
                        phone: selectedClient.phone,
                        email: selectedClient.email
                      },
                      service: 'Consultation',
                      datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                      duration: 60,
                      status: 'scheduled' as const,
                      notes: `Appointment scheduled for ${selectedClient.name}`
                    };
                    webhookService.sendAppointmentBooked(newAppointment);
                  }}
                  className="btn-primary w-full"
                >
                  Schedule Appointment
                </button>
                <button 
                  onClick={() => {
                    console.log('Send Message clicked for:', selectedClient.name);
                    // In a real app, this would trigger SMS/email
                    // For now, we'll send a follow-up event
                    const followUp = {
                      id: Date.now().toString(),
                      client: selectedClient.name,
                      phone: selectedClient.phone,
                      email: selectedClient.email,
                      lastContact: new Date().toISOString(),
                      hoursElapsed: 0,
                      status: 'sent' as const,
                      type: 'follow-up-call' as const,
                      nextAction: 'Manual message sent from dashboard'
                    };
                    webhookService.sendFollowUpTriggered(followUp);
                  }}
                  className="btn-secondary w-full"
                >
                  Send Message
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Client</h3>
              <p className="text-gray-600">Click on a client to view their detailed information and history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}