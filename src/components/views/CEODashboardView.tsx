import React from 'react';
import { Phone, Calendar, DollarSign, Clock, MessageSquare, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { webhookService } from '../../services/webhookService';
import Header from '../layout/Header';

export default function CEODashboardView() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  // Mock data for CEO dashboard
  const getCallStats = () => {
    const baseStats = {
      daily: { completed: 28, missed: 4, ongoing: 2, total: 34 },
      weekly: { completed: 184, missed: 23, ongoing: 3, total: 210 },
      monthly: { completed: 742, missed: 89, ongoing: 5, total: 836 }
    };
    return baseStats[timeframe];
  };

  const getAppointmentStats = () => {
    const baseStats = {
      daily: { today: 12, thisWeek: 67, thisMonth: 284 },
      weekly: { today: 67, thisWeek: 284, thisMonth: 1156 },
      monthly: { today: 284, thisWeek: 1156, thisMonth: 4624 }
    };
    return baseStats[timeframe];
  };

  const getRevenueStats = () => {
    const baseStats = {
      daily: { today: 1850, thisWeek: 12400, thisMonth: 48600, conversionRate: 42.8 },
      weekly: { today: 12400, thisWeek: 48600, thisMonth: 194400, conversionRate: 45.2 },
      monthly: { today: 48600, thisWeek: 194400, thisMonth: 777600, conversionRate: 47.1 }
    };
    return baseStats[timeframe];
  };

  const callStats = getCallStats();
  const appointmentStats = getAppointmentStats();
  const revenueStats = getRevenueStats();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Header 
        title="Dashboard Overview" 
        subtitle="Welcome back! Here's what's happening with your AI receptionist today." 
      />
      
      <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-full">
        {/* Time Filter */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <div></div>
          <div className="flex items-center space-x-2">
            {['daily', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period as 'daily' | 'weekly' | 'monthly')}
                className={`${period === timeframe ? 'btn-primary' : 'btn-secondary'} text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Call Tracking */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">{timeframe}</span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{callStats.total}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Calls</p>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                <span className="text-green-600 dark:text-green-400">{callStats.completed} completed</span>
                <span className="text-red-600 dark:text-red-400">{callStats.missed} missed</span>
                <span className="text-yellow-600 dark:text-yellow-400">{callStats.ongoing} ongoing</span>
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">{timeframe}</span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {timeframe === 'daily' ? appointmentStats.today : 
                 timeframe === 'weekly' ? appointmentStats.thisWeek : appointmentStats.thisMonth}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Appointments</p>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                <span className="text-blue-600 dark:text-blue-400">{appointmentStats.today} today</span>
                <span className="text-gray-600 dark:text-gray-400">{appointmentStats.thisMonth} this month</span>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">{timeframe}</span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                ${(timeframe === 'daily' ? revenueStats.today : 
                   timeframe === 'weekly' ? revenueStats.thisWeek : revenueStats.thisMonth).toLocaleString()}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Revenue</p>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                <span className="text-green-600 dark:text-green-400">{revenueStats.conversionRate}% conversion</span>
                <span className="text-gray-600 dark:text-gray-400">${revenueStats.today} today</span>
              </div>
            </div>
          </div>

          {/* Follow-ups */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Active</span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{followUpStats.pending}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pending Follow-ups</p>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                <span className="text-blue-600 dark:text-blue-400">{followUpStats.sent} sent</span>
                <span className="text-green-600 dark:text-green-400">{followUpStats.responded} responded</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Performance Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Performance Trend ({timeframe})</h2>
            </div>
            
            {/* Simple chart placeholder */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Calls → Bookings</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">42.8%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                <div className="bg-blue-600 h-1.5 sm:h-2 rounded-full" style={{ width: '42.8%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bookings → Revenue</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">78.5%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                <div className="bg-green-600 h-1.5 sm:h-2 rounded-full" style={{ width: '78.5%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Overall Conversion</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">33.6%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                <div className="bg-purple-600 h-1.5 sm:h-2 rounded-full" style={{ width: '33.6%' }}></div>
              </div>
            </div>
          </div>

          {/* Multi-Channel Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <button 
                onClick={() => {
                  console.log('View All clicked');
                  // Send analytics data when viewing all activity
                  const metrics = {
                    totalCalls: callStats.total,
                    completedCalls: callStats.completed,
                    missedCalls: callStats.missed,
                    totalAppointments: appointmentStats.today,
                    confirmedAppointments: Math.floor(appointmentStats.today * 0.8),
                    pendingAppointments: Math.floor(appointmentStats.today * 0.2),
                    totalRevenue: revenueStats.today,
                    totalConversions: Math.floor(appointmentStats.today * 0.6),
                    conversionRate: revenueStats.conversionRate
                  };
                  webhookService.sendDailyMetrics(metrics);
                }}
                className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-2 sm:space-x-4">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'call' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    activity.type === 'sms' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-purple-100 dark:bg-purple-900/20'
                  }`}>
                    {activity.type === 'call' ? (
                      <Phone className={`w-4 h-4 ${
                        activity.type === 'call' ? 'text-blue-600 dark:text-blue-400' :
                        activity.type === 'sms' ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
                      }`} />
                    ) : activity.type === 'sms' ? (
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{activity.client}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.type.toUpperCase()} • {activity.time}</p>
                  </div>
                  <span className={`status-badge ${
                    activity.status === 'completed' ? 'status-success' :
                    activity.status === 'sent' || activity.status === 'delivered' ? 'status-info' :
                    'status-error'
                  } text-xs`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}