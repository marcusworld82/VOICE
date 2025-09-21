import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'admin' | 'paid' | 'trial';
  businessType?: string;
  subscriptionStatus?: 'active' | 'expired' | 'trial';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('ai-receptionist-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Mock authentication - replace with real auth
    if (email === 'admin@aiReceptionist.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        email,
        name: 'Admin User',
        type: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('ai-receptionist-user', JSON.stringify(adminUser));
      setLoading(false);
      return true;
    }
    
    // Mock paid user
    if (email.includes('@') && password.length >= 6) {
      const paidUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        type: 'paid',
        businessType: 'general',
        subscriptionStatus: 'active'
      };
      setUser(paidUser);
      localStorage.setItem('ai-receptionist-user', JSON.stringify(paidUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai-receptionist-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext }