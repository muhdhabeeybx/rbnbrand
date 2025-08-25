import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes?: string[];
  colors?: string[];
  description?: string;
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
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  toggleWishlist: (product: Product) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample products data
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Essential Hoodie - Black",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop",
    category: "hoodies",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Grey"],
    description: "Premium cotton hoodie with minimalist design"
  },
  {
    id: 2,
    name: "Streetwear Tee - White",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop",
    category: "tees",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Grey"],
    description: "Classic streetwear t-shirt with premium fabric"
  },
  {
    id: 3,
    name: "Urban Jacket - Grey",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop",
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Grey", "Black", "Navy"],
    description: "Urban-inspired jacket for all weather"
  },
  {
    id: 4,
    name: "Cargo Pants - Olive",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=600&fit=crop",
    category: "pants",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Olive", "Black", "Khaki"],
    description: "Functional cargo pants with multiple pockets"
  },
  {
    id: 5,
    name: "Oversized Hoodie - Navy",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Black", "White"],
    description: "Oversized fit hoodie for ultimate comfort"
  },
  {
    id: 6,
    name: "Graphic Tee - Black",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1583743814966-8936f37f7378?w=500&h=600&fit=crop",
    category: "tees",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White"],
    description: "Bold graphic design on premium cotton"
  },
  {
    id: 7,
    name: "Bomber Jacket - Black",
    price: 169.99,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=600&fit=crop",
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Olive", "Navy"],
    description: "Classic bomber jacket with modern fit"
  },
  {
    id: 8,
    name: "Track Pants - Black",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop",
    category: "pants",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy"],
    description: "Comfortable track pants for everyday wear"
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    setIsCartOpen,
    setIsMobileMenuOpen,
    toggleWishlist,
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