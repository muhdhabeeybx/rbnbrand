import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Customer {
  email: string;
  name: string;
  phone?: string;
  joinDate: string;
}

interface CustomerContextType {
  customer: Customer | null;
  isLoggedIn: boolean;
  setCustomer: (customer: Customer | null) => void;
  logout: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomerState] = useState<Customer | null>(null);

  const setCustomer = (customerData: Customer | null) => {
    setCustomerState(customerData);
    if (customerData) {
      // Store in sessionStorage for the current session only
      sessionStorage.setItem('rbn_customer', JSON.stringify(customerData));
    } else {
      sessionStorage.removeItem('rbn_customer');
    }
  };

  const logout = () => {
    setCustomerState(null);
    sessionStorage.removeItem('rbn_customer');
  };

  // Try to restore customer from sessionStorage on mount
  React.useEffect(() => {
    const storedCustomer = sessionStorage.getItem('rbn_customer');
    if (storedCustomer) {
      try {
        const customerData = JSON.parse(storedCustomer);
        setCustomerState(customerData);
      } catch (error) {
        sessionStorage.removeItem('rbn_customer');
      }
    }
  }, []);

  const value: CustomerContextType = {
    customer,
    isLoggedIn: !!customer,
    setCustomer,
    logout
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};