import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Simplified admin context for debugging
interface SimpleAdminContextType {
  isAuthenticated: boolean;
  adminToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  products: any[];
  orders: any[];
  customers: any[];
}

const SimpleAdminContext = createContext<SimpleAdminContextType | undefined>(undefined);

export function SimpleAdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const login = async (email: string, password: string) => {
    console.log('Attempting login with:', email);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setAdminToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem('admin_token', data.token);
      console.log('Login successful, token stored');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    setAdminToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
  };

  const checkAuthStatus = async () => {
    console.log('Checking auth status...');
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      console.log('No token found, setting as unauthenticated');
      setIsAuthenticated(false);
      return;
    }

    console.log('Token found, verifying...');
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Verification response:', response.status);

      if (response.ok) {
        console.log('Token valid, setting as authenticated');
        setAdminToken(token);
        setIsAuthenticated(true);
      } else {
        console.log('Token invalid, removing and setting as unauthenticated');
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    console.log('SimpleAdminProvider initializing...');
    checkAuthStatus();
  }, []);

  const value = {
    isAuthenticated,
    adminToken,
    login,
    logout,
    checkAuthStatus,
    products,
    orders,
    customers
  };

  console.log('SimpleAdminProvider rendering with isAuthenticated:', isAuthenticated);

  return (
    <SimpleAdminContext.Provider value={value}>
      {children}
    </SimpleAdminContext.Provider>
  );
}

export function useSimpleAdmin() {
  const context = useContext(SimpleAdminContext);
  if (context === undefined) {
    throw new Error('useSimpleAdmin must be used within a SimpleAdminProvider');
  }
  return context;
}