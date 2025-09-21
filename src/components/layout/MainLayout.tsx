import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CEODashboardView from '../views/CEODashboardView';
import AgentsView from '../views/AgentsView';
import AnalyticsView from '../views/AnalyticsView';
import AppointmentsView from '../views/AppointmentsView';
import ClientsView from '../views/ClientsView';
import SettingsView from '../views/SettingsView';
import { useAuth } from '../../hooks/useAuth';

export type NavigationItem = 'dashboard' | 'agents' | 'analytics' | 'appointments' | 'clients' | 'settings';

export default function MainLayout() {
  const [activeView, setActiveView] = useState<NavigationItem>('dashboard');
  const { user } = useAuth();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <CEODashboardView />;
      case 'agents':
        return <AgentsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'clients':
        return <ClientsView />;
      case 'settings':
        return user?.type === 'admin' ? <SettingsView /> : <CEODashboardView />;
      default:
        return <CEODashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}