import { Settings } from 'lucide-react';

interface SettingsFabProps {
  currentView: string;
}

export default function SettingsFab({ currentView }: SettingsFabProps) {
  // Only show setup button on settings page
  if (currentView !== 'settings') {
    return null;
  }
  
  return (
    <div className="fixed right-4 bottom-4 z-50">
      <a 
        href="/setup" 
        className="flex items-center space-x-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl shadow-lg transition-colors font-medium"
      >
        <Settings className="w-4 h-4" />
        <span>Setup</span>
      </a>
    </div>
  );
}