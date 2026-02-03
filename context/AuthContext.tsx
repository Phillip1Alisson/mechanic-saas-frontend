
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextData extends AuthState {
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { user, token } = authService.getStoredData();
    if (user && token) {
      setState({ user, token, isAuthenticated: true });
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, pass: string) => {
    const { user, token } = await authService.login(email, pass);
    setState({ user, token, isAuthenticated: true });
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setState({ user: null, token: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
