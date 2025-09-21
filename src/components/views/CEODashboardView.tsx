import React from 'react';
import { Phone, Calendar, DollarSign, Clock, MessageSquare, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function CEODashboardView() {
  // Mock data for CEO dashboard
  const callStats = {
    completed: 28,
    missed: 4,
    ongoing: 2,
    total: 34
  };

  const appointmentStats = {
    today: 12,
    thisWeek: 67,
    thisMonth: 284
  };

  const revenueStats = {
    today: 1850,
    thisWeek: 12400,
    thisMonth: 48600,
    conversionRate: 42.8
  };

  const followUpStats = {
    pending: 8,
    sent: 15,
    responded: 6
  };

  const recentActivity = [
    { id: 1, type: 'call', client: 'Sarah Johnson', time: '10:30 AM', status: 'completed' },
    { id: 2, type: 'sms', client: 'Mike Chen', time: '10:15 AM', status: 'sent' },
    { id: 3, type: 'email', client: 'Emma Wilson', time: '9:45 AM', status: 'delivered' },
    { id: 4, type: 'call', client: 'David Brown', time: '9:30 AM', status: 'missed' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your AI receptionist today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Call Tracking */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Today</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">{callStats.total}</h3>
            <p className="text-sm text-gray-600">Total Calls</p>
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-green-600">{callStats.completed} completed</span>
              <span className="text-red-600">{callStats.missed} missed</span>
              <span className="text-yellow-600">{callStats.ongoing} ongoing</span>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">This Week</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">{appointmentStats.thisWeek}</h3>
            <p className="text-sm text-gray-600">Appointments</p>
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-blue-600">{appointmentStats.today} today</span>
              <span className="text-gray-600">{appointmentStats.thisMonth} this month</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">${revenueStats.thisMonth.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Revenue</p>
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-green-600">{revenueStats.conversionRate}% conversion</span>
              <span className="text-gray-600">${revenueStats.today} today</span>
            </div>
          </div>
        </div>

        {/* Follow-ups */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">{followUpStats.pending}</h3>
            <p className="text-sm text-gray-600">Pending Follow-ups</p>
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-blue-600">{followUpStats.sent} sent</span>
              <span className="text-green-600">{followUpStats.responded} responded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trend */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Performance Trend</h2>
            <div className="flex items-center space-x-2">
              <button className="btn-secondary text-sm">Week</button>
              <button className="btn-primary text-sm">Month</button>
            </div>
          </div>
          
          {/* Simple chart placeholder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Calls → Bookings</span>
              <span className="text-sm font-medium text-gray-900">42.8%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42.8%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bookings → Revenue</span>
              <span className="text-sm font-medium text-gray-900">78.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '78.5%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall Conversion</span>
              <span className="text-sm font-medium text-gray-900">33.6%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '33.6%' }}></div>
            </div>
          </div>
        </div>

        {/* Multi-Channel Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'call' ? 'bg-blue-100' :
                  activity.type === 'sms' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'call' ? (
                    <Phone className={`w-4 h-4 ${
                      activity.type === 'call' ? 'text-blue-600' :
                      activity.type === 'sms' ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  ) : activity.type === 'sms' ? (
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.client}</p>
                  <p className="text-xs text-gray-500">{activity.type.toUpperCase()} • {activity.time}</p>
                </div>
                <span className={`status-badge ${
                  activity.status === 'completed' ? 'status-success' :
                  activity.status === 'sent' || activity.status === 'delivered' ? 'status-info' :
                  'status-error'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}