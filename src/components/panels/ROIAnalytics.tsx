import React, { useState } from 'react';
import { TrendingUp, DollarSign, Target, BarChart3, Calendar } from 'lucide-react';

interface MetricData {
  period: string;
  calls: number;
  bookings: number;
  conversions: number;
  revenue: number;
}

export default function ROIAnalytics() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Mock analytics data
  const dailyData: MetricData[] = [
    { period: 'Today', calls: 28, bookings: 12, conversions: 8, revenue: 1200 },
    { period: 'Yesterday', calls: 24, bookings: 10, conversions: 7, revenue: 980 },
    { period: '2 days ago', calls: 31, bookings: 14, conversions: 9, revenue: 1350 },
    { period: '3 days ago', calls: 19, bookings: 8, conversions: 5, revenue: 750 },
    { period: '4 days ago', calls: 33, bookings: 15, conversions: 11, revenue: 1650 },
    { period: '5 days ago', calls: 22, bookings: 9, conversions: 6, revenue: 900 },
    { period: '6 days ago', calls: 27, bookings: 11, conversions: 8, revenue: 1100 },
  ];

  const weeklyData: MetricData[] = [
    { period: 'This Week', calls: 184, bookings: 79, conversions: 54, revenue: 8930 },
    { period: 'Last Week', calls: 156, bookings: 68, conversions: 45, revenue: 7200 },
    { period: '2 weeks ago', calls: 171, bookings: 73, conversions: 49, revenue: 7850 },
    { period: '3 weeks ago', calls: 143, bookings: 61, conversions: 38, revenue: 6100 },
  ];

  const monthlyData: MetricData[] = [
    { period: 'January 2025', calls: 742, bookings: 318, conversions: 218, revenue: 34980 },
    { period: 'December 2024', calls: 689, bookings: 295, conversions: 201, revenue: 32150 },
    { period: 'November 2024', calls: 634, bookings: 271, conversions: 184, revenue: 29440 },
  ];

  const getCurrentData = () => {
    switch (timeframe) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return dailyData;
    }
  };

  const data = getCurrentData();
  const currentPeriod = data[0];
  
  const conversionRate = currentPeriod.calls > 0 ? (currentPeriod.bookings / currentPeriod.calls * 100).toFixed(1) : '0';
  const closingRate = currentPeriod.bookings > 0 ? (currentPeriod.conversions / currentPeriod.bookings * 100).toFixed(1) : '0';
  const averageRevenue = currentPeriod.conversions > 0 ? (currentPeriod.revenue / currentPeriod.conversions).toFixed(0) : '0';

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ROI Analytics</h2>
            <p className="text-gray-400 text-sm">Performance & conversion tracking</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {['daily', 'weekly', 'monthly'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period as 'daily' | 'weekly' | 'monthly')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Total Calls</span>
          </div>
          <div className="text-2xl font-bold text-white">{currentPeriod.calls}</div>
          <div className="text-xs text-gray-400">Inbound + Outbound</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Bookings</span>
          </div>
          <div className="text-2xl font-bold text-white">{currentPeriod.bookings}</div>
          <div className="text-xs text-gray-400">{conversionRate}% conversion rate</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Conversions</span>
          </div>
          <div className="text-2xl font-bold text-white">{currentPeriod.conversions}</div>
          <div className="text-xs text-gray-400">{closingRate}% closing rate</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Revenue</span>
          </div>
          <div className="text-2xl font-bold text-white">${currentPeriod.revenue.toLocaleString()}</div>
          <div className="text-xs text-gray-400">${averageRevenue} avg per sale</div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Trend</h3>
        <div className="space-y-3">
          {data.slice(0, 5).map((item, index) => {
            const maxRevenue = Math.max(...data.map(d => d.revenue));
            const widthPercentage = (item.revenue / maxRevenue) * 100;
            
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-400 text-right">{item.period}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                      style={{ width: `${widthPercentage}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-sm text-white font-medium">${item.revenue}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="p-4 bg-black/20 rounded-xl border border-gray-700">
        <h4 className="text-white font-medium mb-3">Conversion Funnel</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Calls Received</span>
            <span className="text-white font-medium">{currentPeriod.calls}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">→ Appointments Booked</span>
            <span className="text-green-400 font-medium">{currentPeriod.bookings} ({conversionRate}%)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">→ Closed Sales</span>
            <span className="text-purple-400 font-medium">{currentPeriod.conversions} ({closingRate}%)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">→ Total Revenue</span>
            <span className="text-yellow-400 font-bold">${currentPeriod.revenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}