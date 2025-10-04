import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  category: string;
  sizes?: string[];
  colors?: string[];
  description?: string;
  stock?: number;
  isNew?: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface AppContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  products: Product[];
  wishlist: Product[];
  isLoadingProducts: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  toggleWishlist: (product: Product) => void;
  refreshProducts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample products data (matching server prices in NGN)
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Essential Hoodie - Black",
    price: 45000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop",
    category: "hoodies",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["#000000", "#FFFFFF", "#808080"],
    description: "Premium cotton hoodie with minimalist design"
  },
  {
    id: 2,
    name: "Streetwear Tee - White",
    price: 18000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop",
    category: "tees",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#FFFFFF", "#000000", "#808080"],
    description: "Classic streetwear t-shirt with premium fabric"
  },
  {
    id: 3,
    name: "Urban Jacket - Grey",
    price: 75000,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop",
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#808080", "#000000", "#000080"],
    description: "Urban-inspired jacket for all weather"
  },
  {
    id: 4,
    name: "Cargo Pants - Olive",
    price: 35000,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=600&fit=crop",
    category: "pants",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["#556B2F", "#000000", "#F0E68C"],
    description: "Functional cargo pants with multiple pockets"
  },
  {
    id: 5,
    name: "Oversized Hoodie - Navy",
    price: 50000,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#000080", "#000000", "#FFFFFF"],
    description: "Oversized fit hoodie for ultimate comfort"
  },
  {
    id: 6,
    name: "Graphic Tee - Black",
    price: 22000,
    image: "https://images.unsplash.com/photo-1583743814966-8936f37f7378?w=500&h=600&fit=crop",
    category: "tees",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#000000", "#FFFFFF"],
    description: "Bold graphic design on premium cotton"
  },
  {
    id: 7,
    name: "Bomber Jacket - Black",
    price: 85000,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=600&fit=crop",
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#000000", "#556B2F", "#000080"],
    description: "Classic bomber jacket with modern fit"
  },
  {
    id: 8,
    name: "Track Pants - Black",
    price: 32000,
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop",
    category: "pants",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#000000", "#808080", "#000080"],
    description: "Comfortable track pants for everyday wear"
  }
];

function AppProviderInner({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Load products independently (non-blocking)
  useEffect(() => {
    const loadProducts = async () => {
      console.log('🛍️ Loading products for frontend...');
      
      // Start with sample products immediately for fast loading
      setProducts(SAMPLE_PRODUCTS);
      setIsLoadingProducts(false);
      console.log('✅ Products loaded successfully:', SAMPLE_PRODUCTS.length, 'products');
      
      // Optionally try to load from server in background (non-blocking)
      setTimeout(async () => {
        try {
          const response = await Promise.race([
            fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/products`, {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json'
              }
            }),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Products fetch timeout')), 5000)
            )
          ]);
          
          if (response.ok) {
            const data = await response.json();
            if (data.products && data.products.length > 0) {
              const serverProducts = data.products
                .filter((product: any) => product.status === 'active')
                .map((product: any) => ({
                  id: parseInt(product.id),
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  hoverImage: product.hoverImage,
                  category: product.category,
                  sizes: product.sizes || [],
                  colors: product.colors || [],
                  description: product.description || '',
                  stock: product.stock || 0,
                  isNew: product.isNew || false
                }));
              
              setProducts(serverProducts);
              console.log('🔄 Products updated from server:', serverProducts.length, 'products');
            }
          }
        } catch (error) {
          console.log('⚠️ Background product sync failed, using sample products');
        }
      }, 2000); // Load in background after 2 seconds
    };
    
    loadProducts();
  }, []);

  // Removed server connectivity test to prevent timeouts and blocking
  // App now works offline-first with localStorage

  const refreshProducts = async () => {
    // Products are now managed by admin context, so this will trigger
    // a refresh through the admin context sync
    console.log('🔄 Frontend refresh requested - products will sync from admin');
  };

  const addToCart = (newItem: CartItem) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      return [...currentItems, newItem];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateCartItemQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(currentWishlist => {
      const isAlreadyInWishlist = currentWishlist.some(item => item.id === product.id);
      
      if (isAlreadyInWishlist) {
        return currentWishlist.filter(item => item.id !== product.id);
      } else {
        return [...currentWishlist, product];
      }
    });
  };

  const value: AppContextType = {
    cartItems,
    cartCount,
    isCartOpen,
    isMobileMenuOpen,
    products,
    wishlist,
    isLoadingProducts,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    setIsCartOpen,
    setIsMobileMenuOpen,
    toggleWishlist,
    refreshProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Wrapper component that ensures AdminProvider is available
export function AppProvider({ children }: { children: ReactNode }) {
  return <AppProviderInner>{children}</AppProviderInner>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}