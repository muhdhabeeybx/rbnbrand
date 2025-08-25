import React, { useState } from 'react';
import { Menu, X, BarChart3, ShoppingCart, Users, Package, AlertTriangle, Target, TrendingUp, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface MobileAdminNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lowStockCount?: number;
  pendingOrdersCount?: number;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-blue-600' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, color: 'text-green-600', badge: true },
  { id: 'products', label: 'Products', icon: Package, color: 'text-purple-600' },
  { id: 'customers', label: 'Customers', icon: Users, color: 'text-indigo-600' },
  { id: 'inventory', label: 'Inventory', icon: AlertTriangle, color: 'text-red-600', badge: true },
  { id: 'promotions', label: 'Promotions', icon: Target, color: 'text-orange-600' },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'text-cyan-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
];

export function MobileAdminNav({ activeTab, onTabChange, lowStockCount = 3, pendingOrdersCount = 5 }: MobileAdminNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  const getActiveLabel = () => {
    const activeItem = navItems.find(item => item.id === activeTab);
    return activeItem?.label || 'Dashboard';
  };

  const getBadgeCount = (itemId: string) => {
    switch (itemId) {
      case 'orders': return pendingOrdersCount;
      case 'inventory': return lowStockCount;
      default: return null;
    }
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full justify-between mb-6">
            <span className="flex items-center gap-2">
              <Menu className="w-4 h-4" />
              {getActiveLabel()}
            </span>
            <Badge variant="secondary" className="ml-2">
              {navItems.findIndex(item => item.id === activeTab) + 1}/{navItems.length}
            </Badge>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              Admin Dashboard
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-8 space-y-2">
            <AnimatePresence>
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const badgeCount = getBadgeCount(item.id);
                const isActive = activeTab === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => handleTabSelect(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        isActive 
                          ? 'bg-black text-white shadow-lg' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {badgeCount && badgeCount > 0 && (
                        <Badge 
                          variant={isActive ? "secondary" : "destructive"} 
                          className="text-xs"
                        >
                          {badgeCount}
                        </Badge>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Quick Stats</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-medium">{pendingOrdersCount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Low Stock Items</span>
                  <span className="font-medium text-red-600">{lowStockCount}</span>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}