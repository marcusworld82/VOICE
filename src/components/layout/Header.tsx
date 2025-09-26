import React from 'react';
import { Menu } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        {/* Desktop sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:block p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white truncate">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm lg:text-base mt-0.5 line-clamp-2">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}