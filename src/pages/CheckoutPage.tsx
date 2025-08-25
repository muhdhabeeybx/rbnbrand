import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, CheckCircle, MapPin, Mail, Phone, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useCurrency } from '../contexts/CurrencyContext';
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

const countries = [
  { code: 'US', name: 'United States', shipping: 0 },
  { code: 'CA', name: 'Canada', shipping: 15 },
  { code: 'UK', name: 'United Kingdom', shipping: 20 },
  { code: 'NG', name: 'Nigeria', shipping: 25 },
  { code: 'AU', name: 'Australia', shipping: 30 },
  { code: 'DE', name: 'Germany', shipping: 18 },
  { code: 'JP', name: 'Japan', shipping: 35 },
  { code: 'FR', name: 'France', shipping: 18 },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useApp();
  const { formatPrice } = useCurrency();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [selectedCountry, setSelectedCountry] = useState('US');
  
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
    country: 'US',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: 'same',
  });

  // Calculate totals
  const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const selectedCountryData = countries.find(c => c.code === selectedCountry) || countries[0];
  const shippingCost = selectedCountryData.shipping;
  const tax = cartSubtotal * 0.08; // 8% tax
  const total = cartSubtotal + shippingCost + tax;

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
      toast.success('Order placed successfully!');
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
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="font-heading text-4xl mb-4">Your cart is empty</h1>
          <p className="font-body text-gray-600 mb-6">Add some items to your cart to checkout.</p>
          <Button onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading text-3xl md:text-4xl">Checkout</h1>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 'complete' ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center py-16"
            >
              <div className="w-20 h-20 bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl mb-4">Order Complete!</h2>
              <p className="font-body text-lg text-gray-600 mb-8">
                Thank you for your order. You'll receive a confirmation email shortly with tracking information.
              </p>
              <div className="space-y-4">
                <Button 
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/account')}
                >
                  View Order Details
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
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
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
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
                            <div className={`w-12 h-12 flex items-center justify-center transition-all ${
                              isCompleted ? 'bg-green-600 text-white' :
                              isActive ? 'bg-black text-white' :
                              'bg-gray-200 text-gray-400'
                            }`}>
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <span className={`ml-3 font-body font-medium ${
                              isActive ? 'text-black' : 'text-gray-500'
                            }`}>
                              {step.name}
                            </span>
                            {index < steps.length - 1 && (
                              <div className={`w-16 h-px mx-6 transition-all ${
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
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 font-heading">
                            <MapPin className="w-5 h-5" />
                            Shipping Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                First Name *
                              </Label>
                              <Input
                                id="firstName"
                                value={shippingInfo.firstName}
                                onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                                placeholder="John"
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name *</Label>
                              <Input
                                id="lastName"
                                value={shippingInfo.lastName}
                                onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                                placeholder="Doe"
                                className="mt-2"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="email" className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email Address *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={shippingInfo.email}
                              onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="john@example.com"
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label htmlFor="phone" className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={shippingInfo.phone}
                              onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+1 (555) 000-0000"
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label htmlFor="address">Street Address *</Label>
                            <Input
                              id="address"
                              value={shippingInfo.address}
                              onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                              placeholder="123 Main Street"
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                            <Input
                              id="apartment"
                              value={shippingInfo.apartment}
                              onChange={(e) => setShippingInfo(prev => ({ ...prev, apartment: e.target.value }))}
                              placeholder="Apt 4B"
                              className="mt-2"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                value={shippingInfo.city}
                                onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="New York"
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State/Province *</Label>
                              <Input
                                id="state"
                                value={shippingInfo.state}
                                onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                                placeholder="NY"
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                              <Input
                                id="zipCode"
                                value={shippingInfo.zipCode}
                                onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                                placeholder="10001"
                                className="mt-2"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="country">Country *</Label>
                            <Select 
                              value={selectedCountry} 
                              onValueChange={(value) => {
                                setSelectedCountry(value);
                                setShippingInfo(prev => ({ ...prev, country: value }));
                              }}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    {country.name}
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
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 font-heading">
                            <CreditCard className="w-5 h-5" />
                            Payment Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <Tabs defaultValue="card" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="card" className="font-body">Credit Card</TabsTrigger>
                              <TabsTrigger value="paypal" className="font-body">PayPal</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="card" className="space-y-6 mt-6">
                              <div>
                                <Label htmlFor="cardNumber">Card Number *</Label>
                                <Input
                                  id="cardNumber"
                                  value={paymentInfo.cardNumber}
                                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                                  placeholder="1234 5678 9012 3456"
                                  className="mt-2"
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
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cvv">CVV *</Label>
                                  <Input
                                    id="cvv"
                                    value={paymentInfo.cvv}
                                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                                    placeholder="123"
                                    className="mt-2"
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
                                  className="mt-2"
                                />
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="paypal" className="py-12 text-center">
                              <div className="border-2 border-dashed border-gray-200 p-12">
                                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="font-body text-gray-500">
                                  You will be redirected to PayPal to complete your payment securely.
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
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="font-heading">Review Your Order</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          <div>
                            <h3 className="font-body font-semibold text-lg mb-4 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Shipping Address
                            </h3>
                            <div className="font-body text-gray-600 space-y-1 pl-6">
                              <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                              <p>{shippingInfo.address}</p>
                              {shippingInfo.apartment && <p>{shippingInfo.apartment}</p>}
                              <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                              <p>{countries.find(c => c.code === shippingInfo.country)?.name}</p>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-body font-semibold text-lg mb-4 flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Payment Method
                            </h3>
                            <div className="font-body text-gray-600 pl-6">
                              <p>•••• •••• •••• {paymentInfo.cardNumber.slice(-4)}</p>
                              <p>{paymentInfo.nameOnCard}</p>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-body font-semibold text-lg mb-4">Order Items</h3>
                            <div className="space-y-4">
                              {cartItems.map((item) => (
                                <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between items-start">
                                  <div className="flex gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover" />
                                    <div>
                                      <p className="font-body font-medium">{item.name}</p>
                                      <p className="font-body text-sm text-gray-600">
                                        {item.size} • {item.color} • Qty: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="font-body font-semibold">
                                    {formatPrice(item.price * item.quantity)}
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
                    size="lg"
                    onClick={() => {
                      if (currentStep === 'payment') setCurrentStep('shipping');
                      else if (currentStep === 'review') setCurrentStep('payment');
                      else navigate(-1);
                    }}
                  >
                    Back
                  </Button>
                  
                  <Button size="lg" onClick={handleContinue}>
                    {currentStep === 'review' ? 'Place Order' : 'Continue'}
                  </Button>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-heading">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-medium text-sm truncate">{item.name}</p>
                          <p className="font-body text-xs text-gray-500">
                            {item.size} • {item.color} • {item.quantity}x
                          </p>
                        </div>
                        <p className="font-body font-semibold text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-3 font-body">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartSubtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping to {selectedCountryData.name}</span>
                        <span>{shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
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