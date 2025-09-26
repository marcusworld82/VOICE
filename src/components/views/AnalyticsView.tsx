import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Phone, Calendar, Users } from 'lucide-react';

export default function AnalyticsView() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Mock analytics data
  const analyticsData = {
    daily: {
      calls: [12, 15, 8, 22, 18, 25, 19],
      appointments: [5, 8, 3, 12, 9, 15, 11],
      conversions: [3, 6, 2, 8, 7, 12, 8],
      revenue: [450, 900, 300, 1200, 1050, 1800, 1200]
    },
    weekly: {
      calls: [89, 124, 156, 143],
      appointments: [42, 67, 78, 71],
      conversions: [28, 45, 52, 48],
      revenue: [4200, 6750, 7800, 7200]
    },
    monthly: {
      calls: [456, 523, 634, 689],
      appointments: [234, 287, 345, 398],
      conversions: [156, 192, 231, 267],
      revenue: [23400, 28800, 34650, 40050]
    }
  };

  const currentData = analyticsData[timeframe];
  const labels = timeframe === 'daily' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                timeframe === 'weekly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                ['Jan', 'Feb', 'Mar', 'Apr'];

  // Calculate totals and percentages
  const totalCalls = currentData.calls.reduce((a, b) => a + b, 0);
  const totalAppointments = currentData.appointments.reduce((a, b) => a + b, 0);
  const totalConversions = currentData.conversions.reduce((a, b) => a + b, 0);
  const totalRevenue = currentData.revenue.reduce((a, b) => a + b, 0);

  const conversionRate = totalCalls > 0 ? ((totalAppointments / totalCalls) * 100).toFixed(1) : '0';
  const closingRate = totalAppointments > 0 ? ((totalConversions / totalAppointments) * 100).toFixed(1) : '0';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your AI receptionist performance and ROI</p>
        </div>
        
        {/* Timeframe Toggle */}
        <div className="flex items-center space-x-2">
          {['daily', 'weekly', 'monthly'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period as 'daily' | 'weekly' | 'monthly')}
              className={period === timeframe ? 'btn-primary' : 'btn-secondary'}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalCalls}</h3>
          <p className="text-sm text-gray-600">Total Calls</p>
          <p className="text-xs text-green-600 mt-1">+12% from last period</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalAppointments}</h3>
          <p className="text-sm text-gray-600">Appointments Booked</p>
          <p className="text-xs text-green-600 mt-1">{conversionRate}% conversion rate</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalConversions}</h3>
          <p className="text-sm text-gray-600">Conversions</p>
          <p className="text-xs text-green-600 mt-1">{closingRate}% closing rate</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">${totalRevenue.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Revenue Generated</p>
          <p className="text-xs text-green-600 mt-1">+18% from last period</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Calls Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Call Volume</h2>
          <div className="space-y-4">
            {currentData.calls.map((value, index) => {
              const maxValue = Math.max(...currentData.calls);
              const percentage = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600">{labels[index]}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900 text-right">{value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h2>
          <div className="space-y-4">
            {currentData.revenue.map((value, index) => {
              const maxValue = Math.max(...currentData.revenue);
              const percentage = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600">{labels[index]}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-yellow-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-sm font-medium text-gray-900 text-right">${value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-full bg-blue-100 rounded-lg p-6 mb-4">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{totalCalls}</div>
              <div className="text-sm text-gray-600">Calls Received</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-full bg-green-100 rounded-lg p-6 mb-4">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{totalAppointments}</div>
              <div className="text-sm text-gray-600">Appointments Booked</div>
              <div className="text-xs text-green-600 mt-1">{conversionRate}% of calls</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-full bg-purple-100 rounded-lg p-6 mb-4">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{totalConversions}</div>
              <div className="text-sm text-gray-600">Conversions</div>
              <div className="text-xs text-purple-600 mt-1">{closingRate}% of bookings</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-full bg-yellow-100 rounded-lg p-6 mb-4">
              <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Revenue Generated</div>
              <div className="text-xs text-yellow-600 mt-1">${Math.round(totalRevenue / totalConversions)} avg per sale</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}