import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import LoginScreen from './components/auth/LoginScreen';
import MainLayout from './components/layout/MainLayout';
import { useAuth } from './hooks/useAuth';
import SettingsFab from "./components/SettingsFab";
import SupabaseStatus from './components/SupabaseStatus';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="card p-8">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
            <div className="text-gray-900 dark:text-white">Loading AI Receptionist...</div>
          </div>
        </div>
      </div>
    );
  }

  return user ? <MainLayout /> : <LoginScreen />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DashboardProvider>
          <SidebarProvider>
            <AppContent />
            <SettingsFab />
            <div className="fixed top-4 right-4 z-50">
              <SupabaseStatus />
            </div>
          </SidebarProvider>
        </DashboardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;