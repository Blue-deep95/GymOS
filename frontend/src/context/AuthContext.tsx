import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAccessToken } from '../api';

interface AuthContextType {
  token: string | null;
  role: string | null;
  setAuthData: (token: string | null, role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRoleState] = useState<string | null>(null);

  // Update token and role state globally and sync token to Axios module helper
  const setAuthData = (newToken: string | null, newRole: string | null) => {
    setTokenState(newToken);
    setRoleState(newRole);
    setAccessToken(newToken);
  };

  useEffect(() => {
    const handleTokenRefreshed = (event: Event) => {
      const customEvent = event as CustomEvent<{ token: string | null; role: string | null }>;
      const { token: refreshedToken, role: refreshedRole } = customEvent.detail || { token: null, role: null };
      setTokenState(refreshedToken);
      setRoleState(refreshedRole);
    };

    window.addEventListener('token-refreshed', handleTokenRefreshed);
    return () => {
      window.removeEventListener('token-refreshed', handleTokenRefreshed);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
