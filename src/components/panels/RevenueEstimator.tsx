import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Settings } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function RevenueEstimator() {
  const { businessConfig, updateBusinessConfig } = useDashboard();
  const [showSettings, setShowSettings] = useState(false);
  const [tempPrice, setTempPrice] = useState(businessConfig.averageServicePrice);
  
  // Mock booking data for calculations
  const bookingData = {
    today: 12,
    week: 67,
    month: 284,
    pendingToday: 8,
    pendingWeek: 23,
    pendingMonth: 89,
    showRate: 0.85, // 85% show rate
    conversionRate: 0.42 // 42% booking to paid conversion
  };

  const calculateRevenue = (bookings: number, pending: number = 0) => {
    const totalBookings = bookings + (pending * bookingData.showRate);
    const paidConversions = totalBookings * bookingData.conversionRate;
    return Math.round(paidConversions * businessConfig.averageServicePrice);
  };

  const revenueProjections = {
    today: {
      confirmed: calculateRevenue(bookingData.today),
      potential: calculateRevenue(bookingData.today, bookingData.pendingToday)
    },
    week: {
      confirmed: calculateRevenue(bookingData.week),
      potential: calculateRevenue(bookingData.week, bookingData.pendingWeek)
    },
    month: {
      confirmed: calculateRevenue(bookingData.month),
      potential: calculateRevenue(bookingData.month, bookingData.pendingMonth)
    }
  };

  const savePrice = () => {
    updateBusinessConfig({ averageServicePrice: tempPrice });
    setShowSettings(false);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Revenue Estimator</h2>
            <p className="text-gray-400 text-sm">Income projections & forecasting</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-black/30 rounded-xl border border-gray-700">
          <h3 className="text-white font-medium mb-3">Revenue Calculator Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Average Service Price ({businessConfig.currency})
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  />
                </div>
                <button
                  onClick={savePrice}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-gray-400">Show Rate</div>
                <div className="text-white font-bold">{(bookingData.showRate * 100).toFixed(0)}%</div>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-gray-400">Conversion Rate</div>
                <div className="text-white font-bold">{(bookingData.conversionRate * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Configuration */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-medium">Current Configuration</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-300">Business Type:</span>
            <div className="text-white font-medium capitalize">{businessConfig.businessType.replace('-', ' ')}</div>
          </div>
          <div>
            <span className="text-gray-300">Service Price:</span>
            <div className="text-white font-medium">${businessConfig.averageServicePrice} {businessConfig.currency}</div>
          </div>
        </div>
      </div>

      {/* Revenue Projections */}
      <div className="space-y-4">
        {/* Today */}
        <div className="p-4 bg-black/30 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Today's Revenue</h3>
            <div className="text-xs text-gray-400">{bookingData.today} bookings</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 text-sm">Confirmed Revenue</div>
              <div className="text-2xl font-bold text-green-400">
                ${revenueProjections.today.confirmed.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Potential Revenue</div>
              <div className="text-2xl font-bold text-yellow-400">
                ${revenueProjections.today.potential.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            +{bookingData.pendingToday} pending appointments
          </div>
        </div>

        {/* This Week */}
        <div className="p-4 bg-black/30 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Weekly Revenue</h3>
            <div className="text-xs text-gray-400">{bookingData.week} bookings</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 text-sm">Confirmed Revenue</div>
              <div className="text-2xl font-bold text-green-400">
                ${revenueProjections.week.confirmed.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Potential Revenue</div>
              <div className="text-2xl font-bold text-yellow-400">
                ${revenueProjections.week.potential.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            +{bookingData.pendingWeek} pending appointments
          </div>
        </div>

        {/* Monthly */}
        <div className="p-4 bg-black/30 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Monthly Revenue</h3>
            <div className="text-xs text-gray-400">{bookingData.month} bookings</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 text-sm">Confirmed Revenue</div>
              <div className="text-2xl font-bold text-green-400">
                ${revenueProjections.month.confirmed.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Potential Revenue</div>
              <div className="text-2xl font-bold text-yellow-400">
                ${revenueProjections.month.potential.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            +{bookingData.pendingMonth} pending appointments
          </div>
        </div>
      </div>

      {/* Revenue Insights */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-medium">Revenue Insights</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Revenue per booking:</span>
            <span className="text-white">${Math.round(businessConfig.averageServicePrice * bookingData.conversionRate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Weekly growth potential:</span>
            <span className="text-green-400">+${(revenueProjections.week.potential - revenueProjections.week.confirmed).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Monthly growth potential:</span>
            <span className="text-green-400">+${(revenueProjections.month.potential - revenueProjections.month.confirmed).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}