import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  description: string;
  images: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

export interface Location {
  country: string;
  code: string;
  shipping: number;
}

interface AppContextType {
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  // UI State
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  
  // Currency
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencies: Currency[];
  
  // Location
  location: Location;
  setLocation: (location: Location) => void;
  locations: Location[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data
const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.85 },
  { code: 'GBP', symbol: '£', rate: 0.73 },
  { code: 'CAD', symbol: 'C$', rate: 1.25 },
];

const LOCATIONS: Location[] = [
  { country: 'United States', code: 'US', shipping: 0 },
  { country: 'Canada', code: 'CA', shipping: 15 },
  { country: 'United Kingdom', code: 'GB', shipping: 20 },
  { country: 'European Union', code: 'EU', shipping: 25 },
  { country: 'Australia', code: 'AU', shipping: 30 },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [location, setLocation] = useState<Location>(LOCATIONS[0]);

  const addToCart = (product: Product, size: string, color: string, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.size === size && item.color === color
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${size}-${color}-${Date.now()}`,
        product,
        size,
        color,
        quantity,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product.price * item.quantity * currency.rate),
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value: AppContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    currency,
    setCurrency,
    currencies: CURRENCIES,
    location,
    setLocation,
    locations: LOCATIONS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}