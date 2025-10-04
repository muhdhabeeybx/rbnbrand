import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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
  hoverImage?: string;
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
  phone?: string;
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
  createdAt?: string;
  updatedAt?: string;
  paymentReference?: string;
  paymentStatus?: string;
  deliveryMethod?: string;
  timeline?: Array<{
    status: string;
    timestamp: string;
    description: string;
  }>;
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

export interface AdminCategory {
  id: string;
  name: string;
  displayName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminContextType {
  // Products
  products: AdminProduct[];
  isLoadingProducts: boolean;
  addProduct: (product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;

  // Categories
  categories: AdminCategory[];
  addCategory: (category: Omit<AdminCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
  
  // Orders
  orders: AdminOrder[];
  isLoadingOrders: boolean;
  updateOrderStatus: (orderId: string, status: AdminOrder['status'], trackingNumber?: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  
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

// Mock data for fallback
const MOCK_CUSTOMERS: AdminCustomer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 701 234 5678',
    orders: 12,
    totalSpent: 1299.88,
    status: 'VIP',
    lastOrder: '2024-01-15',
    joinDate: '2023-06-15',
    address: {
      street: '123 Main St',
      city: 'Lagos',
      state: 'Lagos',
      zipCode: '10001',
      country: 'Nigeria'
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
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
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

  // Helper function to make robust API calls
  const makeAPICall = async (url: string, options: RequestInit = {}) => {
    try {
      // Use Promise.race for timeout instead of AbortController to avoid "signal is aborted without reason" errors
      const response = await Promise.race([
        fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout after 15 seconds')), 15000)
        )
      ]);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        console.log('⚠️ API call failed for:', url, '- Error:', error.message);
        // Don't throw timeout errors for non-critical requests
        if (error.message.includes('timeout') && url.includes('categories')) {
          console.log('📂 Categories request timed out, continuing without categories');
          return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
      }
      throw error;
    }
  };

  // Categories functions
  const fetchCategories = async () => {
    try {
      console.log('📂 Fetching categories...');
      const response = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/categories`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Categories fetched successfully:', data.categories?.length || 0);
        setCategories(data.categories || []);
      } else {
        console.log('📂 Categories endpoint not available, using default categories');
        // Set default categories instead of making another request
        setCategories([
          { id: '1', name: 'hoodies', displayName: 'Hoodies', description: 'Comfortable hoodies', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', name: 'tees', displayName: 'T-Shirts', description: 'Stylish t-shirts', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '3', name: 'accessories', displayName: 'Accessories', description: 'Fashion accessories', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ]);
      }
    } catch (error) {
      console.log('⚠️ Categories fetch failed, using defaults:', error instanceof Error ? error.message : 'Unknown error');
      // Always provide fallback categories
      setCategories([
        { id: '1', name: 'hoodies', displayName: 'Hoodies', description: 'Comfortable hoodies', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', name: 'tees', displayName: 'T-Shirts', description: 'Stylish t-shirts', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '3', name: 'accessories', displayName: 'Accessories', description: 'Fashion accessories', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ]);
    }
  };

  const initializeCategories = async () => {
    try {
      await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/init-categories`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error initializing categories:', error);
    }
  };

  const addCategory = async (categoryData: Omit<AdminCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/categories`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    const response = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/categories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete category');
    }

    await fetchCategories();
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  // Products functions
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      console.log('🔄 Admin: Fetching products from server...');

      const response = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/products`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Products fetched successfully:', data.products?.length || 0, 'products');
        setProducts(data.products || []);
      } else {
        console.log('⚠️ Products fetch failed, trying to initialize...');
        await initializeProducts();
        // Retry after initialization
        const retryResponse = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/products`);
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          setProducts(retryData.products || []);
        }
      }
    } catch (error) {
      console.log('⚠️ Admin products fetch failed:', error instanceof Error ? error.message : 'Unknown error');
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const initializeProducts = async () => {
    try {
      console.log('Initializing sample products...');
      await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/init-products`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error initializing products:', error);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const addProduct = async (productData: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/products`, {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Created product:', data.product);
      
      // Refresh products list
      await fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<AdminProduct>) => {
    try {
      const response = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Updated product:', data.product);
      
      // Refresh products list
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }
      
      console.log('Deleted product:', id);
      
      // Refresh products list
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  // Orders functions - THE CRITICAL FIX
  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      console.log('🔄 Admin: Starting comprehensive order fetch...');

      const response = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Raw orders response from server:', data);
        console.log('📊 Orders count from server:', data.orders?.length || 0);
        
        if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          // Transform orders with comprehensive error handling
          const transformedOrders = data.orders.map((order: any, index: number) => {
            console.log(`🔄 Transforming order ${index + 1}/${data.orders.length}:`, order.id);
            
            // Handle customer data more robustly
            let customerName = 'Unknown Customer';
            let customerEmail = '';
            let customerPhone = '';
            
            if (typeof order.customer === 'string') {
              customerName = order.customer;
              customerEmail = order.email || '';
              customerPhone = order.phone || '';
            } else if (order.customer && typeof order.customer === 'object') {
              customerName = order.customer.name || 'Unknown Customer';
              customerEmail = order.customer.email || order.email || '';
              customerPhone = order.customer.phone || order.phone || '';
            } else {
              customerEmail = order.email || '';
              customerPhone = order.phone || '';
            }
            
            const transformedOrder = {
              id: order.id || `Order-${Date.now()}-${index}`,
              customer: customerName,
              customerEmail: customerEmail,
              phone: customerPhone,
              total: Number(order.total) || 0,
              status: order.status || 'pending',
              date: order.date || new Date(order.createdAt || Date.now()).toLocaleDateString(),
              items: Array.isArray(order.items) ? order.items : [],
              shippingAddress: order.shippingAddress || {},
              trackingNumber: order.trackingNumber || '',
              timeline: Array.isArray(order.timeline) ? order.timeline : [],
              createdAt: order.createdAt || new Date().toISOString(),
              updatedAt: order.updatedAt || new Date().toISOString(),
              paymentReference: order.paymentReference || '',
              paymentStatus: order.paymentStatus || 'pending',
              deliveryMethod: order.deliveryMethod || 'delivery'
            };
            
            console.log(`✅ Transformed order ${index + 1}:`, {
              id: transformedOrder.id,
              customer: transformedOrder.customer,
              total: transformedOrder.total,
              status: transformedOrder.status
            });
            
            return transformedOrder;
          });
          
          // Sort orders: latest first based on creation time
          const sortedOrders = transformedOrders.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // Latest first
          });
          
          console.log('✅ Successfully processed orders:', sortedOrders.length, 'orders ready for display');
          console.log('📋 Latest orders:', sortedOrders.slice(0, 3).map(o => ({ 
            id: o.id, 
            customer: o.customer, 
            total: o.total, 
            status: o.status,
            createdAt: o.createdAt
          })));
          
          setOrders(sortedOrders);
        } else {
          console.log('📭 No orders found in server response');
          console.log('🔧 Attempting to initialize sample orders...');
          
          try {
            await initializeOrders();
            // Retry after initialization with a delay
            setTimeout(async () => {
              const retryResponse = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders`);
              if (retryResponse.ok) {
                const retryData = await retryResponse.json();
                if (retryData.orders && Array.isArray(retryData.orders)) {
                  console.log('✅ Orders fetched after initialization:', retryData.orders.length);
                  const transformedRetryOrders = retryData.orders.map((order: any) => ({
                    id: order.id || `Order-${Date.now()}`,
                    customer: typeof order.customer === 'string' ? order.customer : order.customer?.name || 'Unknown Customer',
                    customerEmail: order.customer?.email || order.email || '',
                    phone: order.customer?.phone || order.phone || '',
                    total: Number(order.total) || 0,
                    status: order.status || 'pending',
                    date: order.date || new Date(order.createdAt || Date.now()).toLocaleDateString(),
                    items: Array.isArray(order.items) ? order.items : [],
                    shippingAddress: order.shippingAddress || {},
                    trackingNumber: order.trackingNumber || '',
                    timeline: Array.isArray(order.timeline) ? order.timeline : [],
                    createdAt: order.createdAt || new Date().toISOString()
                  }));
                  
                  const sortedRetryOrders = transformedRetryOrders.sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA;
                  });
                  
                  setOrders(sortedRetryOrders);
                } else {
                  setOrders([]);
                }
              }
            }, 2000);
          } catch (initError) {
            console.log('⚠️ Failed to initialize orders:', initError);
            setOrders([]);
          }
        }
      } else {
        console.log('❌ Orders fetch failed with status:', response.status);
        const errorText = await response.text();
        console.log('❌ Error details:', errorText);
        setOrders([]);
      }
    } catch (error) {
      console.log('❌ Admin orders fetch failed with error:', error instanceof Error ? error.message : 'Unknown error');
      console.log('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const initializeOrders = async () => {
    try {
      console.log('🔧 Initializing sample orders...');
      const response = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/init-orders`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Orders initialization result:', data);
      } else {
        console.log('⚠️ Orders initialization failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error initializing orders:', error);
    }
  };

  const refreshOrders = async () => {
    console.log('🔄 Manual order refresh triggered');
    await fetchOrders();
  };

  const updateOrderStatus = async (orderId: string, status: AdminOrder['status'], trackingNumber?: string) => {
    try {
      const updates: any = { status };
      if (trackingNumber) {
        updates.trackingNumber = trackingNumber;
      }

      const response = await makeAPICall(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`);
      }

      console.log('Updated order status:', orderId, status);
      
      // Refresh orders list
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  // Customer functions
  const updateCustomerStatus = (customerId: string, status: AdminCustomer['status']) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, status } : customer
    ));
  };

  // Promotion functions
  const addPromotion = (promotionData: Omit<AdminPromotion, 'id' | 'usageCount'>) => {
    const newPromotion: AdminPromotion = {
      ...promotionData,
      id: Date.now().toString(),
      usageCount: 0,
    };
    setPromotions(prev => [...prev, newPromotion]);
  };

  const updatePromotion = (id: string, updates: Partial<AdminPromotion>) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === id ? { ...promo, ...updates } : promo
    ));
  };

  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(promo => promo.id !== id));
  };

  const togglePromotion = (id: string) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };

  // Modal functions
  const setModal = (modal: keyof AdminContextType['modals'], state: any) => {
    setModals(prev => ({
      ...prev,
      [modal]: state
    }));
  };

  // Analytics calculation from real order data
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    
    // Count unique customers
    const uniqueCustomers = new Set(orders.map(order => order.customerEmail)).size;
    
    // Calculate completion rate as conversion rate
    const completedOrders = orders.filter(order => 
      order.status === 'completed' || order.status === 'delivered'
    ).length;
    const conversionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
    
    return {
      totalRevenue,
      totalOrders,
      totalCustomers: uniqueCustomers,
      conversionRate,
      revenueGrowth: 15, // Placeholder
      orderGrowth: 12, // Placeholder
      customerGrowth: 8, // Placeholder
      conversionGrowth: 3 // Placeholder
    };
  }, [orders]);

  // Initialize data on mount (optimized for fast loading)
  useEffect(() => {
    const initializeAdmin = async () => {
      console.log('🚀 AdminContext mounting - starting optimized initialization...');
      
      // Load categories immediately (with fallbacks)
      fetchCategories().catch(() => console.log('⚠️ Categories using defaults'));
      
      // Load products and orders in parallel for faster loading
      Promise.all([
        fetchProducts().catch(() => console.log('⚠️ Products initialization failed')),
        fetchOrders().catch(() => console.log('⚠️ Orders initialization failed'))
      ]).then(() => {
        console.log('✅ Admin core data loaded');
      });
    };
    
    initializeAdmin();
  }, []);

  // Auto-refresh orders every 2 minutes (less aggressive)
  useEffect(() => {
    // Wait 30 seconds after mount before starting auto-refresh
    const startDelay = setTimeout(() => {
      const refreshInterval = setInterval(() => {
        console.log('🔄 Auto-refreshing orders...');
        fetchOrders().catch(error => {
          console.log('⚠️ Auto-refresh failed, will retry next cycle:', error);
        });
      }, 120000); // 2 minutes instead of 30 seconds

      return () => clearInterval(refreshInterval);
    }, 30000); // Wait 30 seconds before starting

    return () => clearTimeout(startDelay);
  }, []);

  // Force immediate order refresh after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🚀 Forcing immediate order refresh after mount...');
      fetchOrders();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const value: AdminContextType = {
    // Products
    products,
    isLoadingProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    
    // Categories
    categories,
    addCategory,
    deleteCategory,
    refreshCategories,
    
    // Orders
    orders,
    isLoadingOrders,
    updateOrderStatus,
    refreshOrders,
    
    // Customers
    customers,
    updateCustomerStatus,
    
    // Promotions
    promotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotion,
    
    // Analytics
    analytics,
    
    // Modals
    modals,
    setModal
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};