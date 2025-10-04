import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function CartSidebar() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateCartItemQuantity,
    removeFromCart,
    cartCount,
  } = useApp();
  
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartTotal = cartSubtotal;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium font-body">Cart ({cartCount})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>



              {/* Cart Items */}
              <div className="flex-1 overflow-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-2 font-body">Your cart is empty</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/shop');
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate font-body">{item.name}</h3>
                          <p className="text-sm text-gray-500 font-body">
                            {item.size} • {item.color}
                          </p>
                          <p className="font-semibold mt-1 font-body text-product-price">
                            {formatPrice(item.price, 'NGN')}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-body">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between font-body">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartSubtotal, 'NGN')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 font-body">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold font-body text-lg">
                      <span>Total</span>
                      <span>{formatPrice(cartTotal, 'NGN')}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}