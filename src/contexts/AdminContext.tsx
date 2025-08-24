import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for admin data
export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  sales: number;
  revenue: number;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  date: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orders: number;
  totalSpent: number;
  status: 'VIP' | 'Regular' | 'New';
  lastOrder: string;
  joinDate: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface AdminPromotion {
  id: string;
  name: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
  startDate: string;
  endDate?: string;
  description: string;
}

interface AdminContextType {
  // Products
  products: AdminProduct[];
  addProduct: (product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  
  // Orders
  orders: AdminOrder[];
  updateOrderStatus: (orderId: string, status: AdminOrder['status']) => void;
  addTrackingNumber: (orderId: string, trackingNumber: string) => void;
  
  // Customers
  customers: AdminCustomer[];
  updateCustomerStatus: (customerId: string, status: AdminCustomer['status']) => void;
  
  // Promotions
  promotions: AdminPromotion[];
  addPromotion: (promotion: Omit<AdminPromotion, 'id' | 'usageCount'>) => void;
  updatePromotion: (id: string, updates: Partial<AdminPromotion>) => void;
  deletePromotion: (id: string) => void;
  togglePromotion: (id: string) => void;
  
  // Analytics data
  analytics: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    conversionRate: number;
    revenueGrowth: number;
    orderGrowth: number;
    customerGrowth: number;
    conversionGrowth: number;
  };
  
  // Modal states
  modals: {
    addProduct: boolean;
    editProduct: { isOpen: boolean; product?: AdminProduct };
    addPromotion: boolean;
    editPromotion: { isOpen: boolean; promotion?: AdminPromotion };
    orderDetails: { isOpen: boolean; order?: AdminOrder };
    customerDetails: { isOpen: boolean; customer?: AdminCustomer };
  };
  
  setModal: (modal: keyof AdminContextType['modals'], state: any) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock data
const MOCK_PRODUCTS: AdminProduct[] = [
  {
    id: '1',
    name: 'Essential Hoodie - Black',
    price: 89.99,
    category: 'hoodies',
    stock: 45,
    sales: 234,
    revenue: 21066,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop',
    description: 'Premium cotton hoodie with minimalist design',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Grey'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Streetwear Tee - White',
    price: 39.99,
    category: 'tees',
    stock: 23,
    sales: 189,
    revenue: 7560,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
    description: 'Classic streetwear t-shirt with premium fabric',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Grey'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Urban Jacket - Grey',
    price: 149.99,
    category: 'outerwear',
    stock: 12,
    sales: 156,
    revenue: 23399,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop',
    description: 'Urban-inspired jacket for all weather',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Grey', 'Black', 'Navy'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10'
  }
];

const MOCK_ORDERS: AdminOrder[] = [
  {
    id: '#12345',
    customer: 'John Doe',
    customerEmail: 'john@example.com',
    total: 189.98,
    status: 'processing',
    date: '2024-01-15',
    items: [
      {
        productId: '1',
        productName: 'Essential Hoodie - Black',
        quantity: 2,
        price: 89.99,
        size: 'L',
        color: 'Black'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    }
  },
  {
    id: '#12346',
    customer: 'Jane Smith',
    customerEmail: 'jane@example.com',
    total: 159.98,
    status: 'shipped',
    date: '2024-01-14',
    items: [
      {
        productId: '3',
        productName: 'Urban Jacket - Grey',
        quantity: 1,
        price: 149.99,
        size: 'M',
        color: 'Grey'
      }
    ],
    shippingAddress: {
      name: 'Jane Smith',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'US'
    },
    trackingNumber: 'TRK123456789'
  }
];

const MOCK_CUSTOMERS: AdminCustomer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    orders: 12,
    totalSpent: 1299.88,
    status: 'VIP',
    lastOrder: '2024-01-15',
    joinDate: '2023-06-15',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    orders: 8,
    totalSpent: 679.92,
    status: 'Regular',
    lastOrder: '2024-01-14',
    joinDate: '2023-09-20'
  }
];

const MOCK_PROMOTIONS: AdminPromotion[] = [
  {
    id: '1',
    name: 'Summer Sale',
    code: 'SUMMER25',
    type: 'percentage',
    value: 25,
    minOrder: 100,
    isActive: true,
    usageCount: 156,
    usageLimit: 500,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    description: '25% off orders over $100'
  },
  {
    id: '2',
    name: 'First Time Buyer',
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    isActive: true,
    usageCount: 89,
    startDate: '2024-01-01',
    description: '15% off for new customers'
  }
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(MOCK_CUSTOMERS);
  const [promotions, setPromotions] = useState<AdminPromotion[]>(MOCK_PROMOTIONS);
  const [modals, setModals] = useState({
    addProduct: false,
    editProduct: { isOpen: false, product: undefined },
    addPromotion: false,
    editPromotion: { isOpen: false, promotion: undefined },
    orderDetails: { isOpen: false, order: undefined },
    customerDetails: { isOpen: false, customer: undefined }
  });

  const addProduct = (productData: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: AdminProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      sales: 0,
      revenue: 0
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<AdminProduct>) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const updateOrderStatus = (orderId: string, status: AdminOrder['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const addTrackingNumber = (orderId: string, trackingNumber: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, trackingNumber } : order
    ));
  };

  const updateCustomerStatus = (customerId: string, status: AdminCustomer['status']) => {
    setCustomers(customers.map(customer => 
      customer.id === customerId ? { ...customer, status } : customer
    ));
  };

  const addPromotion = (promotionData: Omit<AdminPromotion, 'id' | 'usageCount'>) => {
    const newPromotion: AdminPromotion = {
      ...promotionData,
      id: Date.now().toString(),
      usageCount: 0
    };
    setPromotions([...promotions, newPromotion]);
  };

  const updatePromotion = (id: string, updates: Partial<AdminPromotion>) => {
    setPromotions(promotions.map(promotion => 
      promotion.id === id ? { ...promotion, ...updates } : promotion
    ));
  };

  const deletePromotion = (id: string) => {
    setPromotions(promotions.filter(promotion => promotion.id !== id));
  };

  const togglePromotion = (id: string) => {
    setPromotions(promotions.map(promotion => 
      promotion.id === id ? { ...promotion, isActive: !promotion.isActive } : promotion
    ));
  };

  const setModal = (modal: keyof AdminContextType['modals'], state: any) => {
    setModals(prev => ({ ...prev, [modal]: state }));
  };

  const analytics = {
    totalRevenue: 128450,
    totalOrders: 1254,
    totalCustomers: 342,
    conversionRate: 3.4,
    revenueGrowth: 12.5,
    orderGrowth: 8.2,
    customerGrowth: 15.3,
    conversionGrowth: 0.5
  };

  const value: AdminContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    addTrackingNumber,
    customers,
    updateCustomerStatus,
    promotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotion,
    analytics,
    modals,
    setModal
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}