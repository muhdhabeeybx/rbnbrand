import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'complete';

export function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    currency,
    location,
    setLocation,
    locations,
    clearCart,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: location.code,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: 'same',
  });

  const formatPrice = (price: number) => {
    return `${currency.symbol}${(price * currency.rate).toFixed(2)}`;
  };

  const shippingCost = location.shipping * currency.rate;
  const tax = cartTotal * 0.08; // 8% tax
  const total = cartTotal + shippingCost + tax;

  const handleContinue = () => {
    if (currentStep === 'shipping') {
      // Validate shipping info
      const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
      const missing = required.filter(field => !shippingInfo[field as keyof typeof shippingInfo]);
      
      if (missing.length > 0) {
        toast.error('Please fill in all required fields');
        return;
      }
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      // Validate payment info
      if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.nameOnCard) {
        toast.error('Please fill in all payment details');
        return;
      }
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      // Process order
      setCurrentStep('complete');
      setTimeout(() => {
        clearCart();
      }, 3000);
    }
  };

  const steps = [
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'review', name: 'Review', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  if (cartItems.length === 0 && currentStep !== 'complete') {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 'complete' ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center py-16"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Order Complete!</h2>
              <p className="text-gray-600 mb-8">
                Thank you for your order. You'll receive a confirmation email shortly.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => navigate('/account')}
                >
                  View Order Details
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/shop')}
                >
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <motion.div 
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {/* Progress Steps */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = index === currentStepIndex;
                        const isCompleted = index < currentStepIndex;
                        
                        return (
                          <div key={step.id} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted ? 'bg-green-600 text-white' :
                              isActive ? 'bg-black text-white' :
                              'bg-gray-200 text-gray-400'
                            }`}>
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <span className={`ml-3 ${
                              isActive ? 'font-medium' : 'text-gray-500'
                            }`}>
                              {step.name}
                            </span>
                            {index < steps.length - 1 && (
                              <div className={`w-16 h-px mx-6 ${
                                isCompleted ? 'bg-green-600' : 'bg-gray-200'
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  {currentStep === 'shipping' && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name *</Label>
                              <Input
                                id="firstName"
                                value={shippingInfo.firstName}
                                onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                                placeholder="John"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name *</Label>
                              <Input
                                id="lastName"
                                value={shippingInfo.lastName}
                                onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                                placeholder="Doe"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={shippingInfo.email}
                              onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="john@example.com"
                            />
                          </div>

                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={shippingInfo.phone}
                              onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>

                          <div>
                            <Label htmlFor="address">Address *</Label>
                            <Input
                              id="address"
                              value={shippingInfo.address}
                              onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                              placeholder="123 Main Street"
                            />
                          </div>

                          <div>
                            <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                            <Input
                              id="apartment"
                              value={shippingInfo.apartment}
                              onChange={(e) => setShippingInfo(prev => ({ ...prev, apartment: e.target.value }))}
                              placeholder="Apt 4B"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                value={shippingInfo.city}
                                onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="New York"
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State *</Label>
                              <Input
                                id="state"
                                value={shippingInfo.state}
                                onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                                placeholder="NY"
                              />
                            </div>
                            <div>
                              <Label htmlFor="zipCode">ZIP Code *</Label>
                              <Input
                                id="zipCode"
                                value={shippingInfo.zipCode}
                                onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                                placeholder="10001"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="country">Country *</Label>
                            <Select 
                              value={shippingInfo.country} 
                              onValueChange={(value) => {
                                setShippingInfo(prev => ({ ...prev, country: value }));
                                const newLocation = locations.find(l => l.code === value);
                                if (newLocation) setLocation(newLocation);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {locations.map((loc) => (
                                  <SelectItem key={loc.code} value={loc.code}>
                                    {loc.country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {currentStep === 'payment' && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <Tabs defaultValue="card" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="card">Credit Card</TabsTrigger>
                              <TabsTrigger value="paypal">PayPal</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="card" className="space-y-4 mt-6">
                              <div>
                                <Label htmlFor="cardNumber">Card Number *</Label>
                                <Input
                                  id="cardNumber"
                                  value={paymentInfo.cardNumber}
                                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                                  placeholder="1234 5678 9012 3456"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                                  <Input
                                    id="expiryDate"
                                    value={paymentInfo.expiryDate}
                                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                                    placeholder="MM/YY"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cvv">CVV *</Label>
                                  <Input
                                    id="cvv"
                                    value={paymentInfo.cvv}
                                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                                    placeholder="123"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="nameOnCard">Name on Card *</Label>
                                <Input
                                  id="nameOnCard"
                                  value={paymentInfo.nameOnCard}
                                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, nameOnCard: e.target.value }))}
                                  placeholder="John Doe"
                                />
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="paypal" className="py-8 text-center">
                              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                                <p className="text-gray-500">
                                  You will be redirected to PayPal to complete your payment.
                                </p>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {currentStep === 'review' && (
                    <motion.div
                      key="review"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Review Your Order</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h3 className="font-medium mb-3">Shipping Address</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                              <p>{shippingInfo.address}</p>
                              {shippingInfo.apartment && <p>{shippingInfo.apartment}</p>}
                              <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                              <p>{locations.find(l => l.code === shippingInfo.country)?.country}</p>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-medium mb-3">Payment Method</h3>
                            <p className="text-sm text-gray-600">
                              •••• •••• •••• {paymentInfo.cardNumber.slice(-4)}
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-medium mb-3">Order Items</h3>
                            <div className="space-y-3">
                              {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                  <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {item.size} • {item.color} • Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="font-medium">
                                    {formatPrice(item.product.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentStep === 'payment') setCurrentStep('shipping');
                      else if (currentStep === 'review') setCurrentStep('payment');
                      else navigate(-1);
                    }}
                  >
                    Back
                  </Button>
                  
                  <Button onClick={handleContinue}>
                    {currentStep === 'review' ? 'Place Order' : 'Continue'}
                  </Button>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.size} • {item.color} • {item.quantity}x
                          </p>
                        </div>
                        <p className="font-medium text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartTotal / currency.rate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{shippingCost > 0 ? formatPrice(shippingCost / currency.rate) : 'Free'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(tax / currency.rate)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>{formatPrice(total / currency.rate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}