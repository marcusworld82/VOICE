import React, { useState } from 'react';
import { Calendar, Plus, Clock, User, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { webhookService } from '../../services/webhookService';

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

export default function AppointmentsView() {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
    },
    {
      id: '5',
      client: { name: 'Lisa Martinez', phone: '+1 (555) 333-4444', email: 'lisa@email.com' },
      service: 'Check-up',
      datetime: '2025-01-17T11:00:00',
      duration: 30,
      status: 'confirmed'
    }
  ];

  const todayAppointments = appointments.filter(apt => 
    apt.datetime.startsWith(selectedDate)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-success';
      case 'scheduled': return 'status-info';
      case 'completed': return 'status-success';
      case 'cancelled': return 'status-error';
      case 'no-show': return 'status-warning';
      default: return 'status-info';
    }
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Appointments</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your appointment calendar and bookings</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {['day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as 'day' | 'week' | 'month')}
                className={`${mode === viewMode ? 'btn-primary' : 'btn-secondary'} text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => {
              try {
                console.log('New Appointment clicked');
                // In a real app, this would open a modal or form
                // For now, we'll simulate creating an appointment
                const newAppointment = {
                  id: Date.now().toString(),
                  client: { name: 'New Client', phone: '+1 (555) 000-0000', email: 'new@email.com' },
                  service: 'Consultation',
                  datetime: new Date().toISOString(),
                  duration: 60,
                  status: 'scheduled' as const,
                  notes: 'New appointment created from dashboard'
                };
                webhookService.sendAppointmentBooked(newAppointment);
              } catch (error) {
                console.error('Failed to create appointment:', error);
              }
            }}
            className="btn-primary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{todayAppointments.length}</h3>
          <p className="text-xs sm:text-sm text-gray-600">Today's Appointments</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
            {appointments.filter(a => a.status === 'confirmed').length}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">Confirmed</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
            {appointments.filter(a => a.status === 'scheduled').length}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">Pending</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">67</h3>
          <p className="text-xs sm:text-sm text-gray-600">This Week</p>
        </div>
      </div>

      {/* Calendar and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="card p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Calendar View</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field text-xs sm:text-sm"
                />
                <button 
                  onClick={() => console.log('Filter clicked')}
                  className="btn-secondary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                >
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-1 sm:space-y-2">
              {Array.from({ length: 10 }, (_, i) => {
                const hour = 9 + i;
                const timeSlot = `${hour}:00`;
                const appointment = appointments.find(apt => {
                  const aptTime = new Date(apt.datetime);
                  return aptTime.getHours() === hour && apt.datetime.startsWith(selectedDate);
                });

                return (
                  <div key={hour} className="flex items-center space-x-2 sm:space-x-4 py-2 sm:py-3 border-b border-gray-100">
                    <div className="w-12 sm:w-16 text-xs sm:text-sm text-gray-500 font-medium">
                      {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                    </div>
                    <div className="flex-1">
                      {appointment ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 lg:p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm sm:text-base font-medium text-gray-900">{appointment.client.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-600">{appointment.service}</p>
                              <p className="text-xs text-gray-500">{appointment.duration} minutes</p>
                            </div>
                            <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs sm:text-sm italic">Available</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <div className="card p-3 sm:p-4 lg:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Today's Schedule</h2>
            <div className="space-y-3 sm:space-y-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-1 sm:mb-2">
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-gray-900">{appointment.client.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{formatTime(appointment.datetime)}</p>
                      </div>
                      <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">{appointment.service}</p>
                    {appointment.notes && (
                      <p className="text-xs text-gray-500 italic">{appointment.notes}</p>
                    )}
                    <div className="flex items-center space-x-1 sm:space-x-2 mt-2 sm:mt-3">
                      <button 
                        onClick={() => {
                          console.log('Confirm appointment for:', appointment.client.name);
                          const confirmedAppointment = { ...appointment, status: 'confirmed' as const };
                          webhookService.sendAppointmentConfirmed(confirmedAppointment);
                        }}
                        className="btn-primary text-xs px-2 py-1"
                      >
                        <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                        Confirm
                      </button>
                      <button 
                        onClick={() => {
                          console.log('Reschedule appointment for:', appointment.client.name);
                          const oldDateTime = appointment.datetime;
                          const rescheduledAppointment = { 
                            ...appointment, 
                            datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Next day
                          };
                          webhookService.sendAppointmentRescheduled(rescheduledAppointment, oldDateTime);
                        }}
                        className="btn-secondary text-xs px-2 py-1"
                      >
                        <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-xs sm:text-sm">No appointments scheduled for today</p>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="card p-3 sm:p-4 lg:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Upcoming</h2>
            <div className="space-y-3">
              {appointments.filter(apt => !apt.datetime.startsWith(selectedDate)).slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-xs sm:text-sm">{appointment.client.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(appointment.datetime)} • {formatTime(appointment.datetime)}
                    </p>
                  </div>
                  <span className={`status-badge text-xs ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Calendar Sync */}
          <div className="card p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-gray-900">Google Calendar</h3>
                <p className="text-xs text-gray-500">Synced via n8n workflow</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
              Appointments are automatically synced with your Google Calendar in real-time.
            </p>
            <button 
              onClick={() => window.location.href = '/integrations'}
              className="btn-secondary text-xs sm:text-sm w-full py-2"
            >
              Configure Sync Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}