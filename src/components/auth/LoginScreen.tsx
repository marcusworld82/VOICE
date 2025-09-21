import React, { useState } from 'react';
import { Phone, Shield, Star, CreditCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Try admin@aiReceptionist.com / admin123');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        
        {/* Left Side - Branding & Features */}
        <div className="card p-8 lg:p-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Receptionist
              </h1>
              <p className="text-gray-600">Universal Dashboard</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Transform Your Business Communications
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            The ultimate AI-powered receptionist dashboard that handles calls, bookings, and client management for any business type.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-gray-900 font-semibold">Smart Call Management</h3>
                <p className="text-gray-600">AI-powered call tracking with real-time transcription and analysis</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Star className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-gray-900 font-semibold">Automated Bookings</h3>
                <p className="text-gray-600">Seamless appointment scheduling with Google Calendar integration</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CreditCard className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-gray-900 font-semibold">ROI Analytics</h3>
                <p className="text-gray-600">Track conversions and revenue with detailed performance insights</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-600 font-medium">Demo Credentials:</p>
            <p className="text-gray-700 text-sm">admin@aiReceptionist.com / admin123</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="card p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your dashboard' : 'Create your account and start your free trial'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {!isLogin && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-600 font-medium text-sm">✨ 14-Day Free Trial</p>
              <p className="text-gray-600 text-xs mt-1">No credit card required. Cancel anytime.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}