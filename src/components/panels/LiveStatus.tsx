import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';

export default function LiveStatus() {
  // Mock daily snapshot data
  const todayStats = {
    calls: { current: 28, target: 30, change: +12 },
    bookings: { current: 12, target: 15, change: -8 },
    noShows: { current: 2, target: 0, change: +1 },
    revenue: { current: 1850, target: 2000, change: +15 },
    conversionRate: { current: 42.8, target: 50, change: -5.2 },
    avgCallDuration: { current: 4.2, target: 5.0, change: +0.3 }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Live Status Board</h2>
            <p className="text-gray-400 text-sm">Real-time daily performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Live</span>
          <span className="text-gray-400 text-xs">{currentTime}</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Calls */}
        <div className="p-4 bg-black/30 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Calls</span>
            <div className={`flex items-center space-x-1 ${getChangeColor(todayStats.calls.change)}`}>
              {getChangeIcon(todayStats.calls.change)}
              <span className="text-xs">{Math.abs(todayStats.calls.change)}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{todayStats.calls.current}</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Target: {todayStats.calls.target}</span>
            <span className={`${getChangeColor(todayStats.calls.current - todayStats.calls.target)}`}>
              {todayStats.calls.current >= todayStats.calls.target ? '✓' : `${todayStats.calls.target - todayStats.calls.current} to go`}
            </span>
          </div>
          <div className="mt-2 bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
              style={{ width: `${getProgressPercentage(todayStats.calls.current, todayStats.calls.target)}%` }}
            ></div>
          </div>
        </div>

        {/* Bookings */}
        <div className="p-4 bg-black/30 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Bookings</span>
            <div className={`flex items-center space-x-1 ${getChangeColor(todayStats.bookings.change)}`}>
              {getChangeIcon(todayStats.bookings.change)}
              <span className="text-xs">{Math.abs(todayStats.bookings.change)}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{todayStats.bookings.current}</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Target: {todayStats.bookings.target}</span>
            <span className={`${getChangeColor(todayStats.bookings.current - todayStats.bookings.target)}`}>
              {todayStats.bookings.current >= todayStats.bookings.target ? '✓' : `${todayStats.bookings.target - todayStats.bookings.current} to go`}
            </span>
          </div>
          <div className="mt-2 bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
              style={{ width: `${getProgressPercentage(todayStats.bookings.current, todayStats.bookings.target)}%` }}
            ></div>
          </div>
        </div>

        {/* Revenue */}
        <div className="p-4 bg-black/30 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Revenue</span>
            <div className={`flex items-center space-x-1 ${getChangeColor(todayStats.revenue.change)}`}>
              {getChangeIcon(todayStats.revenue.change)}
              <span className="text-xs">{Math.abs(todayStats.revenue.change)}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">${todayStats.revenue.current.toLocaleString()}</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Target: ${todayStats.revenue.target.toLocaleString()}</span>
            <span className={`${getChangeColor(todayStats.revenue.current - todayStats.revenue.target)}`}>
              {todayStats.revenue.current >= todayStats.revenue.target ? '✓' : `$${(todayStats.revenue.target - todayStats.revenue.current).toLocaleString()} to go`}
            </span>
          </div>
          <div className="mt-2 bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
              style={{ width: `${getProgressPercentage(todayStats.revenue.current, todayStats.revenue.target)}%` }}
            ></div>
          </div>
        </div>

        {/* No-Shows */}
        <div className="p-4 bg-black/30 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">No-Shows</span>
            <div className={`flex items-center space-x-1 text-red-400`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">{todayStats.noShows.change}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-red-400 mb-1">{todayStats.noShows.current}</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Target: {todayStats.noShows.target}</span>
            <span className="text-red-400">
              {todayStats.noShows.current > todayStats.noShows.target ? `${todayStats.noShows.current} over target` : '✓ On target'}
            </span>
          </div>
          <div className="mt-2 bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
              style={{ width: `${todayStats.noShows.current > 0 ? Math.min(todayStats.noShows.current * 50, 100) : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-purple-400 text-sm font-medium">Conversion Rate</span>
            <div className={`flex items-center space-x-1 ${getChangeColor(todayStats.conversionRate.change)}`}>
              {getChangeIcon(todayStats.conversionRate.change)}
              <span className="text-xs">{Math.abs(todayStats.conversionRate.change)}%</span>
            </div>
          </div>
          <div className="text-lg font-bold text-white">{todayStats.conversionRate.current}%</div>
          <div className="text-xs text-purple-300">Target: {todayStats.conversionRate.target}%</div>
        </div>

        <div className="p-3 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 rounded-xl border border-indigo-500/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-indigo-400 text-sm font-medium">Avg Call Duration</span>
            <div className={`flex items-center space-x-1 ${getChangeColor(todayStats.avgCallDuration.change)}`}>
              {getChangeIcon(todayStats.avgCallDuration.change)}
              <span className="text-xs">{Math.abs(todayStats.avgCallDuration.change)}min</span>
            </div>
          </div>
          <div className="text-lg font-bold text-white">{todayStats.avgCallDuration.current} min</div>
          <div className="text-xs text-indigo-300">Target: {todayStats.avgCallDuration.target} min</div>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 font-medium">Today's Summary</span>
          <span className="text-xs text-gray-500">Updated: {currentTime}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white font-medium">Performance Status</div>
            <div className="text-gray-400">
              {todayStats.calls.current >= todayStats.calls.target * 0.9 && 
               todayStats.bookings.current >= todayStats.bookings.target * 0.8 ? (
                <span className="text-green-400">🟢 On Track</span>
              ) : todayStats.calls.current >= todayStats.calls.target * 0.7 ? (
                <span className="text-yellow-400">🟡 Behind Target</span>
              ) : (
                <span className="text-red-400">🔴 Needs Attention</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-white font-medium">Next Milestone</div>
            <div className="text-gray-400">
              {todayStats.calls.current < todayStats.calls.target 
                ? `${todayStats.calls.target - todayStats.calls.current} more calls to target`
                : todayStats.bookings.current < todayStats.bookings.target
                ? `${todayStats.bookings.target - todayStats.bookings.current} more bookings to target`
                : '🎯 All targets achieved!'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}