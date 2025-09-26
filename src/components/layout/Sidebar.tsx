import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Calendar, 
  UserCheck, 
  Settings, 
  LogOut,
  Phone,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';
import { useTheme } from '../../context/ThemeContext';
import { NavigationItem } from './MainLayout';

interface SidebarProps {
  activeView: NavigationItem;
  onViewChange: (view: NavigationItem) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const { isOpen, toggleSidebar } = useSidebar();
  const { isDark, toggleTheme } = useTheme();

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
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${!isOpen ? 'lg:w-16' : 'lg:w-64'}`}>
        
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${!isOpen ? 'lg:justify-center' : ''}`}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              {(isOpen) && (
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Receptionist</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
                </div>
              )}
            </div>
            
            {/* Mobile close button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto bg-white dark:bg-gray-800">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={`${isActive ? 'sidebar-item-active' : 'sidebar-item'} w-full ${
                  !isOpen ? 'lg:justify-center lg:px-2' : ''
                }`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {(isOpen) && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={toggleTheme}
            className={`sidebar-item w-full mb-3 ${!isOpen ? 'lg:justify-center lg:px-2' : ''}`}
            title={!isOpen ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
            {(isOpen) && <span className="text-gray-900 dark:text-white">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          
          {/* User Info */}
          <div className={`flex items-center space-x-3 mb-3 ${!isOpen ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            {(isOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.type}</p>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className={`sidebar-item w-full text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 ${
              !isOpen ? 'lg:justify-center lg:px-2' : ''
            }`}
            title={!isOpen ? 'Sign Out' : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {(isOpen) && <span className="text-sm text-red-600 dark:text-red-400">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
}