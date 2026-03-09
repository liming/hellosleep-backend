'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  type AuthUser,
  saveAuthToStorage,
  clearAuthFromStorage,
  getStoredAuth,
  loginWithEmail,
  registerWithEmail,
} from '@/lib/auth';

interface AuthContextValue {
  user: AuthUser | null;
  jwt: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const LAST_ASSESSMENT_KEY = 'hellosleep_last_assessment';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { jwt: storedJwt, user: storedUser } = getStoredAuth();
    if (storedJwt && storedUser) {
      setJwt(storedJwt);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const data = await loginWithEmail(identifier, password);
    saveAuthToStorage(data.jwt, data.user);
    setJwt(data.jwt);
    setUser(data.user);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const data = await registerWithEmail(username, email, password);
    saveAuthToStorage(data.jwt, data.user);
    setJwt(data.jwt);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearAuthFromStorage();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LAST_ASSESSMENT_KEY);
    }
    setJwt(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, jwt, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
