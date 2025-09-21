import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Calendar, 
  UserCheck, 
  Settings, 
  LogOut,
  Phone
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NavigationItem } from './MainLayout';

interface SidebarProps {
  activeView: NavigationItem;
  onViewChange: (view: NavigationItem) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();

  const navigationItems = [
    { id: 'dashboard' as NavigationItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents' as NavigationItem, label: 'Agents', icon: Users },
    { id: 'analytics' as NavigationItem, label: 'Analytics', icon: BarChart3 },
    { id: 'appointments' as NavigationItem, label: 'Appointments', icon: Calendar },
    { id: 'clients' as NavigationItem, label: 'Clients', icon: UserCheck },
  ];

  if (user?.type === 'admin') {
    navigationItems.push({ id: 'settings' as NavigationItem, label: 'Settings', icon: Settings });
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Receptionist</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={isActive ? 'sidebar-item-active w-full' : 'sidebar-item w-full'}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.type}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 w-full px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}