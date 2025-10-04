import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, LogOut, Truck, Calendar, DollarSign, Eye, Mail, Search, ShoppingBag, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Separator } from '../components/ui/separator';
import { motion } from 'motion/react';
import { useCustomer } from '../contexts/CustomerContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

export function AccountPage() {
  const { formatPrice } = useCurrency();
  const { customer, isLoggedIn, setCustomer, logout } = useCustomer();
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);

  // Enhanced sync with detailed debugging
  const syncOrdersFromBackend = async (email: string) => {
    try {
      console.log('🔄 SYNC START: Fetching orders from backend for:', email);
      
      const response = await Promise.race([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Backend sync timeout')), 8000)
        )
      ]);

      console.log('📡 Backend response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Total orders from backend:', data.orders?.length || 0);
        
        const customerOrders = data.orders?.filter(order => {
          const orderEmail = order.customer?.email || order.customerEmail || order.email;
          const matches = orderEmail && orderEmail.toLowerCase() === email.toLowerCase();
          if (matches) {
            console.log('✅ Found customer order:', order.id, 'Status:', order.status);
          }
          return matches;
        }) || [];

        console.log('🎯 Customer orders found:', customerOrders.length);

        if (customerOrders.length === 0) {
          console.log('❌ No orders found for customer:', email);
          return false;
        }

        // Update localStorage with complete order data from backend
        let updatedCount = 0;
        for (const backendOrder of customerOrders) {
          if (backendOrder.id) {
            const localStorageKey = `rbn_order_${backendOrder.id}`;
            
            console.log(`🔄 Processing order ${backendOrder.id}:`);
            console.log('  - Backend status:', backendOrder.status);
            console.log('  - Backend tracking:', backendOrder.trackingNumber);
            console.log('  - Full backend order:', backendOrder);
            
            // Get existing local order
            const existingLocalOrder = localStorage.getItem(localStorageKey);
            
            if (existingLocalOrder) {
              try {
                const localOrder = JSON.parse(existingLocalOrder);
                console.log('  - Local status before update:', localOrder.status);
                console.log('  - Local order data:', localOrder);
                
                // Only update status-related fields, preserve everything else from local
                const updatedOrder = {
                  ...localOrder, // Keep all local data as base
                  // Only update these specific fields from backend
                  status: backendOrder.status || localOrder.status,
                  trackingNumber: backendOrder.trackingNumber || localOrder.trackingNumber,
                  timeline: backendOrder.timeline || localOrder.timeline,
                  updatedAt: backendOrder.updatedAt || new Date().toISOString(),
                  lastSyncedAt: new Date().toISOString()
                };
                
                // Check if anything actually changed
                const statusChanged = localOrder.status !== updatedOrder.status;
                const trackingChanged = localOrder.trackingNumber !== updatedOrder.trackingNumber;
                
                if (statusChanged || trackingChanged) {
                  localStorage.setItem(localStorageKey, JSON.stringify(updatedOrder));
                  console.log('✅ Order updated:');
                  console.log('  - Status:', localOrder.status, '→', updatedOrder.status);
                  console.log('  - Tracking:', localOrder.trackingNumber, '→', updatedOrder.trackingNumber);
                  updatedCount++;
                } else {
                  console.log('ℹ️ No changes detected for order:', backendOrder.id);
                }
              } catch (e) {
                console.log('❌ Error updating order:', backendOrder.id, e);
              }
            } else {
              // Order not in localStorage - this might be an old order or admin-created order
              console.log('📦 Order not found in localStorage, checking if we should add it...');
              try {
                const newOrder = {
                  ...backendOrder,
                  lastSyncedAt: new Date().toISOString()
                };
                localStorage.setItem(localStorageKey, JSON.stringify(newOrder));
                console.log('➕ Added order to localStorage:', backendOrder.id);
                updatedCount++;
              } catch (e) {
                console.log('❌ Error adding new order:', backendOrder.id, e);
              }
            }
          }
        }

        console.log(`✅ SYNC COMPLETE: Updated ${updatedCount} orders`);
        return updatedCount;
      } else {
        console.log('❌ Backend sync failed - Status:', response.status);
        return false;
      }
    } catch (error) {
      console.log('❌ Backend sync error:', error.message);
      return false;
    }
  };



  // Get customer orders from localStorage (orders are stored when placed)
  const getCustomerOrders = (email: string) => {
    try {
      const allOrders = [];
      const searchEmail = email.toLowerCase();
      
      // Get all order keys from localStorage (try multiple key patterns)
      const keyPatterns = ['rbn_order_', 'pending_order_', 'order_'];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const isOrderKey = keyPatterns.some(pattern => key && key.startsWith(pattern));
        
        if (key && isOrderKey) {
          try {
            const orderData = JSON.parse(localStorage.getItem(key) || '{}');
            
            // Check multiple possible email locations
            const orderEmail = orderData.customer?.email || 
                              orderData.customerEmail || 
                              orderData.email ||
                              orderData.customer_email ||
                              orderData.user?.email;
            
            if (orderEmail && orderEmail.toLowerCase() === searchEmail) {
              allOrders.push({
                ...orderData,
                id: orderData.id || key.replace(/^(rbn_order_|pending_order_|order_)/, ''),
                date: orderData.date || new Date(orderData.createdAt || Date.now()).toLocaleDateString(),
                status: orderData.status || 'pending'
              });
            }
          } catch (parseError) {
            console.log('Error parsing order:', key);
          }
        }
      }
      
      // Sort orders by creation date (newest first)
      return allOrders.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    } catch (error) {
      console.error('Error getting customer orders:', error);
      return [];
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const email = emailInput.trim().toLowerCase();
    setIsLoading(true);

    // Simulate brief loading for better UX
    setTimeout(async () => {
      // First sync with backend to get latest order status
      await syncOrdersFromBackend(email);
      
      // Then get orders for this email from localStorage
      const orders = getCustomerOrders(email);
      
      if (orders.length > 0) {
        // Create customer data from the most recent order
        const latestOrder = orders[0];
        const customerData = {
          email: email,
          name: latestOrder.customer?.name || email.split('@')[0],
          phone: latestOrder.customer?.phone || '',
          joinDate: orders[orders.length - 1]?.createdAt || new Date().toISOString()
        };

        setCustomer(customerData);
        toast.success(`Welcome back, ${customerData.name}!`);
      } else {
        // No orders found for this email
        toast.error('No account found with this email address. Place an order to create your account!');
      }
      
      setIsLoading(false);
    }, 800);
  };

  const getCustomerOrdersForDisplay = () => {
    if (!customer?.email) return [];
    return getCustomerOrders(customer.email);
  };

  // Auto-sync orders when customer is logged in
  useEffect(() => {
    if (customer?.email && !isRefreshingOrders) {
      setIsRefreshingOrders(true);
      syncOrdersFromBackend(customer.email).finally(() => {
        setIsRefreshingOrders(false);
      });
    }
  }, [customer?.email]);

  const orders = getCustomerOrdersForDisplay();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logout();
    setEmailInput('');
    toast.success('Logged out successfully');
  };

  // If not logged in, show email input
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-gray-600" />
              </div>
              <h1 className="font-heading text-3xl mb-4">Access Your Account</h1>
              <p className="font-body text-gray-600">
                Enter your email address to view your order history and account details.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="font-body">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="your.email@example.com"
                        className="pl-10 font-body"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-body">
                      Use the same email address you used when placing orders
                    </p>
                  </div>



                  <Button
                    type="submit"
                    disabled={isLoading || !emailInput.trim()}
                    className="w-full font-body"
                  >
                    {isLoading ? (
                      <>
                        <Search className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 mr-2" />
                        Access My Account
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-body">
                    💡 <strong>New to Rain by Nurain?</strong> Your account will be automatically created when you place your first order.
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/shop')}
                    className="font-body text-sm"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show customer dashboard
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl">
                Welcome back, {customer?.name}
              </h1>
              <p className="font-body text-gray-600 mt-2">
                Manage your orders and account preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 mr-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-right">
                  <p className="font-body text-sm font-medium">{customer?.name}</p>
                  <p className="font-body text-xs text-gray-500">{customer?.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Account Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body text-gray-600">Total Orders</span>
                  <span className="font-semibold">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-gray-600">Total Spent</span>
                  <span className="font-semibold">
                    {formatPrice(orders.reduce((sum, order) => sum + (order.total || 0), 0), 'NGN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-gray-600">Active Orders</span>
                  <span className="font-semibold">
                    {orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-gray-600">Member Since</span>
                  <span className="font-semibold">
                    {customer?.joinDate ? new Date(customer.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-body font-medium mb-2">Continue Shopping</h3>
                  <p className="font-body text-sm text-gray-600 mb-4">
                    Discover new arrivals and exclusive items
                  </p>
                  <Button 
                    onClick={() => navigate('/shop')} 
                    className="w-full"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shop Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order History ({orders.length})
                  {isRefreshingOrders && (
                    <span className="ml-2 text-xs text-blue-600">Updating...</span>
                  )}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (customer?.email) {
                          console.log('🔄 Manual refresh triggered for:', customer.email);
                          setIsRefreshingOrders(true);
                          
                          // Add debug info before sync
                          console.log('📋 Orders before sync:', getCustomerOrders(customer.email).map(o => ({
                            id: o.id,
                            status: o.status,
                            lastSyncedAt: o.lastSyncedAt
                          })));
                          
                          const synced = await syncOrdersFromBackend(customer.email);
                          
                          // Add debug info after sync
                          console.log('📋 Orders after sync:', getCustomerOrders(customer.email).map(o => ({
                            id: o.id,
                            status: o.status,
                            lastSyncedAt: o.lastSyncedAt
                          })));
                          
                          setIsRefreshingOrders(false);
                          
                          if (synced) {
                            toast.success(`Orders updated! ${synced} changes found.`);
                            // Force re-render to show updated data
                            window.location.reload();
                          } else {
                            toast.info('No updates found - orders are current or sync failed');
                            
                            // Show debug info in console
                            console.log('🔍 DEBUGGING - No sync detected:');
                            console.log('📍 Customer email:', customer.email);
                            console.log('📦 Local orders:', getCustomerOrders(customer.email));
                            console.log('💾 All localStorage keys:', Object.keys(localStorage).filter(k => k.includes('order')));
                          }
                        }
                      }}
                      disabled={isRefreshingOrders}
                      className="text-xs"
                    >
                      {isRefreshingOrders ? 'Updating...' : 'Refresh'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('🔍 SYSTEM DEBUG:');
                        console.log('👤 Customer:', customer);
                        console.log('📧 Customer Email:', customer?.email);
                        console.log('📦 Current Orders:', orders);
                        console.log('💾 LocalStorage Orders:', getCustomerOrders(customer?.email || ''));
                        console.log('🔑 All localStorage Keys:', Object.keys(localStorage));
                        console.log('🔑 Order Keys:', Object.keys(localStorage).filter(k => k.includes('order')));
                        toast.info('Debug info logged to console');
                      }}
                      className="text-xs"
                    >
                      Debug
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="font-body font-medium mb-2">No orders yet</h3>
                    <p className="font-body text-sm mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Button onClick={() => navigate('/shop')}>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-lg">{order.id}</span>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {order.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {formatPrice(order.total, 'NGN')}
                              </span>
                              {order.trackingNumber && (
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Truck className="w-4 h-4" />
                                  {order.trackingNumber}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Items:</p>
                              <ul className="text-sm">
                                {order.items?.map((item, index) => (
                                  <li key={index} className="text-gray-700">
                                    • {item.name} ({item.quantity}x) - {item.size && `${item.size}`}{item.color && `, ${item.color}`}
                                  </li>
                                )) || <li className="text-gray-500">Order details not available</li>}
                              </ul>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.info('Order tracking will be available once your order ships')}
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Track
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Details Modal */}
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details - {selectedOrder?.id}
              </DialogTitle>
              <DialogDescription>
                View comprehensive details about your order including items, delivery information, payment status, and order timeline.
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Order Date: {selectedOrder.date}
                    </span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="text-sm">
                      <span className="text-gray-600">Tracking: </span>
                      <span className="font-mono font-medium text-blue-600">{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name: </span>
                        <span className="font-medium">{selectedOrder.customer?.name || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email: </span>
                        <span className="font-medium">{selectedOrder.customer?.email || selectedOrder.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone: </span>
                        <span className="font-medium">{selectedOrder.customer?.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Delivery Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Method: </span>
                        <span className="font-medium">{selectedOrder.deliveryMethod || 'Standard Delivery'}</span>
                      </div>
                      {selectedOrder.shippingAddress && (
                        <>
                          <div>
                            <span className="text-gray-600">Address: </span>
                            <span className="font-medium">
                              {selectedOrder.shippingAddress.street}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">State: </span>
                            <span className="font-medium">{selectedOrder.shippingAddress.state}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.size && item.color && <span> • </span>}
                            {item.color && <span>Color: {item.color}</span>}
                            <span> • Quantity: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatPrice(item.price, 'NGN')}</div>
                          <div className="text-sm text-gray-600">each</div>
                        </div>
                      </div>
                    )) || (
                      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                        No items found
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedOrder.subtotal || 0, 'NGN')}</span>
                    </div>
                    {selectedOrder.deliveryFee && (
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee:</span>
                        <span>{formatPrice(selectedOrder.deliveryFee, 'NGN')}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg pt-2">
                      <span>Total:</span>
                      <span>{formatPrice(selectedOrder.total, 'NGN')}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                {selectedOrder.paymentReference && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Payment Information</h3>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-green-700">Status: </span>
                        <span className="font-medium text-green-800">
                          {selectedOrder.paymentStatus === 'paid' ? 'Payment Confirmed' : selectedOrder.paymentStatus}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-700">Reference: </span>
                        <span className="font-mono text-green-800">{selectedOrder.paymentReference}</span>
                      </div>
                      <div>
                        <span className="text-green-700">Method: </span>
                        <span className="font-medium text-green-800">
                          {selectedOrder.paymentMethod === 'paystack' ? 'Card Payment (Paystack)' : selectedOrder.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Order Timeline</h3>
                    <div className="space-y-4">
                      {selectedOrder.timeline.map((event, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            event.status === selectedOrder.status ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            <div className="w-2 h-2 bg-current rounded-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium capitalize">{event.description}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.timestamp).toLocaleDateString()} at {new Date(event.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => setShowOrderDetails(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}