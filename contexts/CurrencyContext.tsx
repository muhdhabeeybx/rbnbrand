import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'USD' | 'NGN';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number, sourceCurrency?: Currency) => string;
  convertPrice: (price: number, sourceCurrency?: Currency) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rate (in real app, this would come from an API)
const EXCHANGE_RATE = 1650; // 1 USD = 1650 NGN (approximate)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('NGN');

  const convertPrice = (price: number, sourceCurrency: Currency = 'NGN'): number => {
    // If source and target currency are the same, no conversion needed
    if (sourceCurrency === currency) {
      return price;
    }
    
    // Convert between NGN and USD
    if (sourceCurrency === 'NGN' && currency === 'USD') {
      return price / EXCHANGE_RATE;
    } else if (sourceCurrency === 'USD' && currency === 'NGN') {
      return price * EXCHANGE_RATE;
    }
    
    return price;
  };

  const formatPrice = (price: number, sourceCurrency: Currency = 'NGN'): string => {
    const convertedPrice = convertPrice(price, sourceCurrency);
    
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(convertedPrice);
    } else {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      }).format(convertedPrice);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}