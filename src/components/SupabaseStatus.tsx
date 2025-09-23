import React from 'react';
import { Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';

export default function SupabaseStatus() {
  const { isConnected, loading, tenantSlug } = useSupabase();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        <span className="text-sm text-gray-600">Connecting to Supabase...</span>
      </div>
    );
  }

  // Check if environment variables are missing
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
        <Database className="w-4 h-4" />
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Supabase Not Configured</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
      isConnected 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      <Database className="w-4 h-4" />
      {isConnected ? (
        <>
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Supabase Connected</span>
          {tenantSlug && (
            <span className="text-xs bg-green-200 px-2 py-1 rounded">
              {tenantSlug}
            </span>
          )}
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Supabase Disconnected</span>
          <AlertCircle className="w-4 h-4" />
        </>
      )}
    </div>
  );
}