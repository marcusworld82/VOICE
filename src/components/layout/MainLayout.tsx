import React, { useState } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from './Sidebar';
import CEODashboardView from '../views/CEODashboardView';
import AgentsView from '../views/AgentsView';
import AnalyticsView from '../views/AnalyticsView';
import AppointmentsView from '../views/AppointmentsView';
import ClientsView from '../views/ClientsView';
import SettingsView from '../views/SettingsView';
import { useAuth } from '../../hooks/useAuth';
import SettingsFab from '../SettingsFab';

export type NavigationItem = 'dashboard' | 'agents' | 'analytics' | 'appointments' | 'clients' | 'settings';

export default function MainLayout() {
  const [activeView, setActiveView] = useState<NavigationItem>('dashboard');
  const { user } = useAuth();
  const { isOpen } = useSidebar();

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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className={`flex-1 overflow-auto transition-all duration-300 ${
        isOpen ? 'lg:ml-0' : 'lg:ml-0'
      }`}>
        {renderView()}
        <SettingsFab currentView={activeView} />
      </main>
    </div>
  );
}