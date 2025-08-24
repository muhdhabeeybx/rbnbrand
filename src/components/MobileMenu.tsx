import React from 'react';
import { X, User, ShoppingBag, Heart, Home, Store, Users, Mail, Shield } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export function MobileMenu() {
  const { isMobileMenuOpen, setIsMobileMenuOpen, cartCount } = useApp();
  const navigate = useNavigate();

  // Check if current user is admin (in real app, this would come from auth context)
  const isAdmin = true; // For demo purposes

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Store, label: 'Shop', path: '/shop' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Mail, label: 'Contact', path: '/contact' },
    { icon: User, label: 'Account', path: '/account' },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    menuItems.push({ icon: Shield, label: 'Admin Dashboard', path: '/admin' });
  }

  const handleNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-xl md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black rounded-full" />
                  <div>
                    <h2 className="font-bold">RBN</h2>
                    <p className="text-xs text-gray-500">Rain by Nurain</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex-1 p-6">
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center gap-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors ${
                        item.label === 'Admin Dashboard' ? 'text-purple-600' : ''
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-4">Shop Categories</h3>
                  <div className="space-y-2">
                    <Link
                      to="/shop/hoodies"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-2 text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      Hoodies
                    </Link>
                    <Link
                      to="/shop/tees"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-2 text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      T-Shirts
                    </Link>
                    <Link
                      to="/shop/pants"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-2 text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      Pants
                    </Link>
                    <Link
                      to="/shop/outerwear"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-2 text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      Outerwear
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t p-6">
                <p className="text-xs text-gray-500 mb-4">
                  "Left Home to Feed Home"
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/shop');
                  }}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shop
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}