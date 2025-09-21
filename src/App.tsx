import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import LoginScreen from './components/auth/LoginScreen';
import MainLayout from './components/layout/MainLayout';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card p-8">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
            <div className="text-gray-900">Loading AI Receptionist...</div>
          </div>
        </div>
      </div>
    );
  }

  return user ? <MainLayout /> : <LoginScreen />;
}

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <AppContent />
      </DashboardProvider>
    </AuthProvider>
  );
}

export default App;