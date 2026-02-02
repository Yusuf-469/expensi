'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { User, CurrencyCode } from '../types';
import { useLocalStorage } from '../lib/hooks/useLocalStorage';
import { generateId } from '../lib/utils';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, currency?: CurrencyCode) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '',
    defaultCurrency: 'USD',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: '',
    defaultCurrency: 'USD',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: '',
    defaultCurrency: 'EUR',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    avatar: '',
    defaultCurrency: 'GBP',
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('expensi_user', null);
  const [users, setUsers] = useLocalStorage<User[]>('expensi_users', DEMO_USERS);

  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    
    // For demo: accept any password for demo users
    const demoUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (demoUser) {
      setUser(demoUser);
      if (!users.find(u => u.id === demoUser.id)) {
        setUsers(prev => [...prev, demoUser]);
      }
      return true;
    }
    
    return false;
  }, [users, setUser, setUsers]);

  const signup = useCallback(async (
    name: string, 
    email: string, 
    password: string,
    currency: CurrencyCode = 'USD'
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }
    
    const newUser: User = {
      id: generateId(),
      name,
      email,
      avatar: '',
      defaultCurrency: currency,
      createdAt: new Date().toISOString(),
    };
    
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  }, [users, setUser, setUsers]);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  }, [user, setUser, setUsers]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
