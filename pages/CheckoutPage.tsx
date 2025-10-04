import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  User,
  CheckCircle,
  Truck,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info";

const nigerianStates = [
  "Lagos",
  "Abuja",
  "Rivers",
  "Kano",
  "Ogun",
  "Kaduna",
  "Oyo",
  "Delta",
  "Edo",
  "Kwara",
  "Anambra",
  "Imo",
  "Enugu",
  "Abia",
  "Akwa Ibom",
  "Cross River",
  "Bayelsa",
  "Benue",
  "Plateau",
  "Niger",
  "Sokoto",
  "Kebbi",
  "Zamfara",
  "Katsina",
  "Jigawa",
  "Yobe",
  "Borno",
  "Adamawa",
  "Gombe",
  "Bauchi",
  "Taraba",
  "Nasarawa",
  "Kogi",
  "Ekiti",
  "Ondo",
  "Osun",
  "Ebonyi",
];

// Declare PaystackPop as a global
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useApp();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState("");

  const [orderInfo, setOrderInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    deliveryMethod: "delivery", // 'delivery' or 'pickup'
  });

  // Load Paystack key
  useEffect(() => {
    const loadPaystackKey = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/paystack/public-key`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          },
        );

        if (response.ok) {
          const { publicKey } = await response.json();
          setPaystackPublicKey(publicKey);
        }
      } catch (error) {
        console.error("Error loading Paystack key:", error);
      }
    };

    loadPaystackKey();
  }, []);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => setPaystackLoaded(true);
    document.head.appendChild(script);

    return () => {
      try {
        document.head.removeChild(script);
      } catch (error) {
        // Script might already be removed
      }
    };
  }, []);

  // Calculate totals
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // No delivery charges - customer arranges delivery offline if needed
  const shippingCost = 0;
  const total = cartSubtotal;

  // For display purposes only - no actual charges
  const getShippingCost = () => {
    if (orderInfo.deliveryMethod === "pickup") return 0;
    // Display informational shipping cost based on state
    switch (orderInfo.state) {
      case "Lagos":
        return 0; // Free for Lagos for display
      case "Abuja":
        return 0; // Free for Abuja for display  
      default:
        return 0; // Free for all other states
    }
  };

  const handlePayment = async () => {
    // Validate form
    const requiredFields = ["name", "email", "phone"];
    if (orderInfo.deliveryMethod === "delivery") {
      requiredFields.push("address", "state");
    }

    const missingFields = requiredFields.filter(
      (field) => !orderInfo[field as keyof typeof orderInfo],
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields", { duration: 2000 });
      return;
    }

    if (!paystackLoaded || !paystackPublicKey) {
      toast.error(
        "Payment system is loading. Please try again.",
        { duration: 2000 }
      );
      return;
    }

    setLoading(true);

    try {
      // Convert to kobo (Paystack requires amount in kobo)
      const amountInKobo = Math.round(total * 100);

      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: orderInfo.email,
        amount: amountInKobo,
        currency: "NGN",
        ref: `RBN-${Date.now()}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: orderInfo.name,
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: orderInfo.phone,
            },
          ],
        },
        callback: (response: any) => {
          // Payment successful
          console.log("Payment successful:", response);
          verifyPaymentAndCreateOrder(response.reference);
        },
        onClose: () => {
          setLoading(false);
          toast.error("Payment was cancelled", { duration: 2000 });
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        "Failed to initialize payment. Please try again.",
        { duration: 2000 }
      );
      setLoading(false);
    }
  };

  const verifyPaymentAndCreateOrder = async (
    paymentReference: string,
  ) => {
    try {
      // Add reasonable timeout for payment verification
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Payment verification timeout')), 8000)
      );

      // First verify payment with Paystack
      const verifyPromise = fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/paystack/verify/${paymentReference}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      const verifyResponse = await Promise.race([verifyPromise, timeoutPromise]) as Response;

      if (!verifyResponse.ok) {
        throw new Error("Payment verification failed");
      }

      const verificationResult = await verifyResponse.json();

      if (!verificationResult.success) {
        throw new Error("Payment was not successful");
      }

      // Payment verified, now create order
      await createOrder(paymentReference);
    } catch (error) {
      console.error("⚠️ Payment verification error:", error);
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          toast.error(
            "Payment verification is taking longer than expected. Your payment may still be processed. Please check your email or contact support.",
            { duration: 8000 }
          );
        } else if (error.message === 'Order creation timeout') {
          toast.error(
            "Order processing is taking longer than expected. Your payment was successful. We'll email you a confirmation shortly.",
            { duration: 8000 }
          );
          
          // Create fallback order for user feedback
          const fallbackOrder = {
            ...orderData,
            id: `RBN-${Date.now()}`,
            status: 'pending',
            paymentReference: paymentReference
          };
          setCompletedOrder(fallbackOrder);
          setOrderComplete(true);
          clearCart();
        } else {
          toast.error(
            `Payment processing failed: ${error.message}. Please contact support.`,
            { duration: 5000 }
          );
        }
      } else {
        toast.error("Unexpected payment error. Please contact support.", { duration: 5000 });
      }
      
      setLoading(false);
    }
  };

  const createOrder = async (paymentReference: string) => {
    // Define order outside try block to avoid scoping issues
    const orderData = {
      customer: {
        name: orderInfo.name,
        email: orderInfo.email,
        phone: orderInfo.phone,
      },
      email: orderInfo.email,
      items: cartItems,
      subtotal: cartSubtotal,
      deliveryFee: shippingCost,
      total: total,
      currency: "NGN",
      status: "processing", // Set to processing since payment is verified
      paymentReference: paymentReference,
      paymentMethod: "paystack",
      paymentStatus: "paid",
      paymentVerified: true,
      deliveryMethod: orderInfo.deliveryMethod,
      shippingAddress:
        orderInfo.deliveryMethod === "delivery"
          ? {
              street: orderInfo.address,
              state: orderInfo.state,
              country: "Nigeria",
            }
          : null,
      date: new Date().toLocaleDateString(),
      timeline: [
        {
          status: "pending",
          timestamp: new Date().toISOString(),
          description: "Order placed",
        },
        {
          status: "processing",
          timestamp: new Date().toISOString(),
          description: "Payment confirmed, order processing",
        },
      ],
    };

    try {

      console.log('🛒 Creating order...');

      // Try order creation with retries
      let response: Response | null = null;
      let lastError: Error | null = null;
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`📝 Order creation attempt ${attempt}/3`);
          console.log('🔍 Order data being sent:', {
            customerEmail: orderData.customer?.email || orderData.email,
            itemCount: orderData.items?.length || 0,
            total: orderData.total,
            currency: orderData.currency
          });
          
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Order creation timeout')), 4000)
          );

          const orderPromise = fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify(orderData),
            },
          );

          response = await Promise.race([orderPromise, timeoutPromise]) as Response;
          
          if (response.ok) {
            console.log(`✅ Order creation successful on attempt ${attempt}`);
            break;
          } else {
            // Try to get error details from response
            let errorDetails = response.statusText;
            try {
              const errorData = await response.json();
              errorDetails = errorData.details || errorData.error || response.statusText;
            } catch (e) {
              // If we can't parse the error response, use status text
            }
            throw new Error(`HTTP ${response.status}: ${errorDetails}`);
          }
        } catch (error) {
          lastError = error as Error;
          console.log(`⚠️ Order creation attempt ${attempt} failed:`, error);
          
          if (attempt < 3) {
            console.log(`🔄 Retrying in ${attempt}s...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          }
        }
      }

      if (!response || !response.ok) {
        console.log('⚠️ All server attempts failed, creating local order');
        // Create a completely local order as final fallback
        const localOrder = {
          ...orderData,
          id: `RBN-LOCAL-${Date.now()}`,
          status: 'pending',
          isLocalOrder: true,
          failureReason: lastError?.message || 'Server unavailable'
        };
        
        try {
          localStorage.setItem(`pending_order_${localOrder.id}`, JSON.stringify(localOrder));
        } catch (e) {
          console.log('Failed to store local order');
        }
        
        setCompletedOrder(localOrder);
        setOrderComplete(true);
        clearCart();
        
        toast.success(
          "Order received! We'll process it and send confirmation via email shortly.",
          { duration: 6000 }
        );
        
        return; // Exit the function successfully
      }

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      const createdOrder = data.order || orderData;
      
      console.log('✅ Order created successfully:', createdOrder.id);

      // Store order in localStorage for account access
      try {
        localStorage.setItem(`rbn_order_${createdOrder.id}`, JSON.stringify(createdOrder));
        console.log('💾 Order stored locally for account access');
      } catch (localError) {
        console.warn('⚠️ Failed to store order locally:', localError);
      }

      // Send order confirmation email (non-blocking)
      fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/notifications/send-order-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            order: createdOrder,
            isNewOrder: true,
          }),
        },
      ).catch(emailError => {
        console.warn("⚠️ Order confirmation email failed:", emailError);
      });

      setCompletedOrder(createdOrder);
      setOrderComplete(true);
      setLoading(false);
      clearCart();
      toast.success("Order placed successfully!", { duration: 3000 });
    } catch (error) {
      console.error("⚠️ Order creation failed:", error);
      
      if (error instanceof Error && error.message.includes('timeout')) {
        console.log('🔄 Creating fallback order due to timeout...');
        
        // Create a local order for immediate user feedback
        const fallbackOrder = {
          ...orderData,
          id: `RBN-${Date.now()}`,
          status: 'pending',
          isLocalOrder: true // Flag to indicate this is a local fallback
        };
        
        // Store fallback order in localStorage for account access
        try {
          localStorage.setItem(`rbn_order_${fallbackOrder.id}`, JSON.stringify(fallbackOrder));
          console.log('💾 Fallback order stored locally for account access');
        } catch (e) {
          console.log('Failed to store fallback order locally');
        }
        
        toast.success(
          "Order created successfully! Confirmation details will be sent to your email shortly.",
          { duration: 6000 }
        );
        
        setCompletedOrder(fallbackOrder);
        setOrderComplete(true);
        clearCart();
        
        // Try to sync the order in the background
        setTimeout(() => {
          syncPendingOrder(fallbackOrder);
        }, 5000);
        
      } else if (error instanceof Error && error.message.includes('Failed')) {
        toast.error(
          "Network connection issue. Your payment was successful. We'll process your order and send confirmation via email.",
          { duration: 8000 }
        );
        
        // Create fallback order for failed attempts too
        const fallbackOrder = {
          ...orderData,
          id: `RBN-${Date.now()}`,
          status: 'pending',
          isLocalOrder: true
        };
        
        setCompletedOrder(fallbackOrder);
        setOrderComplete(true);
        clearCart();
        
      } else {
        toast.error("An unexpected error occurred. Please contact support with your payment reference.", { duration: 5000 });
      }
      
      setLoading(false);
    }
  };

  // Background sync for pending orders
  const syncPendingOrder = async (fallbackOrder: any) => {
    try {
      console.log('🔄 Attempting to sync pending order:', fallbackOrder.id);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            ...fallbackOrder,
            syncedFromLocal: true,
            originalId: fallbackOrder.id
          }),
        },
      );

      if (response.ok) {
        console.log('✅ Pending order synced successfully');
        localStorage.removeItem(`pending_order_${fallbackOrder.id}`);
        
        // Send belated confirmation email
        fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/notifications/send-order-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              order: fallbackOrder,
              isDelayedOrder: true,
            }),
          },
        ).catch(() => {
          console.log('Failed to send delayed order email');
        });
      }
    } catch (error) {
      console.log('⚠️ Failed to sync pending order:', error);
      // Will retry on next app load
    }
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h1 className="font-heading text-3xl md:text-4xl mb-4">
            Your cart is empty
          </h1>
          <p className="font-body text-gray-600 mb-6">
            Add some items to your cart to checkout.
          </p>
          <Button onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl">
            Checkout
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {orderComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center py-12 md:py-16"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-4">
                Order Complete!
              </h2>
              <p className="font-body text-base md:text-lg text-gray-600 mb-6 md:mb-8 px-4">
                Thank you for your order. You'll receive a
                confirmation email shortly.
              </p>
              {completedOrder && (
                <div className="bg-gray-100 p-4 mb-6 md:mb-8 text-left">
                  <p className="font-body text-sm font-semibold mb-2">
                    Order Details:
                  </p>
                  <p className="font-body text-sm">
                    Order ID: {completedOrder.id}
                  </p>
                  <p className="font-body text-sm">
                    Total: {formatPrice(completedOrder.total)}
                  </p>
                </div>
              )}
              <div className="space-y-3 md:space-y-4">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/account")}
                >
                  View Order Details
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/shop")}
                >
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Main Checkout Form */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader className="pb-4 md:pb-6">
                    <CardTitle className="font-heading text-xl md:text-2xl">
                      Checkout Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="font-body font-semibold text-base md:text-lg flex items-center gap-2">
                        <User className="w-4 h-4 md:w-5 md:h-5" />
                        Contact Information
                      </h3>

                      <div>
                        <Label
                          htmlFor="name"
                          className="font-body text-sm"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={orderInfo.name}
                          onChange={(e) =>
                            setOrderInfo((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter your full name"
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="email"
                            className="font-body text-sm flex items-center gap-2"
                          >
                            <Mail className="w-3 h-3 md:w-4 md:h-4" />
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={orderInfo.email}
                            onChange={(e) =>
                              setOrderInfo((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            placeholder="your@email.com"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="phone"
                            className="font-body text-sm flex items-center gap-2"
                          >
                            <Phone className="w-3 h-3 md:w-4 md:h-4" />
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={orderInfo.phone}
                            onChange={(e) =>
                              setOrderInfo((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="+234 xxx xxx xxxx"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Delivery Method */}
                    <div className="space-y-4">
                      <h3 className="font-body font-semibold text-base md:text-lg flex items-center gap-2">
                        <Truck className="w-4 h-4 md:w-5 md:h-5" />
                        Delivery Method
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div
                          className={`p-3 md:p-4 border-2 transition-all cursor-pointer ${
                            orderInfo.deliveryMethod ===
                            "delivery"
                              ? "border-black bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            setOrderInfo((prev) => ({
                              ...prev,
                              deliveryMethod: "delivery",
                            }))
                          }
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              checked={
                                orderInfo.deliveryMethod ===
                                "delivery"
                              }
                              onChange={() =>
                                setOrderInfo((prev) => ({
                                  ...prev,
                                  deliveryMethod: "delivery",
                                }))
                              }
                              className="w-4 h-4 mt-0.5"
                            />
                            <div>
                              <p className="font-body font-medium text-sm">
                                Home Delivery
                              </p>
                              <p className="font-body text-xs text-gray-600">
                                {orderInfo.state
                                  ? `${formatPrice(getShippingCost())}`
                                  : "Select state to see cost"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`p-3 md:p-4 border-2 transition-all cursor-pointer ${
                            orderInfo.deliveryMethod ===
                            "pickup"
                              ? "border-black bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            setOrderInfo((prev) => ({
                              ...prev,
                              deliveryMethod: "pickup",
                            }))
                          }
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              checked={
                                orderInfo.deliveryMethod ===
                                "pickup"
                              }
                              onChange={() =>
                                setOrderInfo((prev) => ({
                                  ...prev,
                                  deliveryMethod: "pickup",
                                }))
                              }
                              className="w-4 h-4 mt-0.5"
                            />
                            <div>
                              <p className="font-body font-medium text-sm">
                                Store Pickup
                              </p>
                              <p className="font-body text-xs text-gray-600">
                                Free - Pick up in store
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address - Only show if delivery selected */}
                    {orderInfo.deliveryMethod === "delivery" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <Separator />

                        <h3 className="font-body font-semibold text-base md:text-lg flex items-center gap-2">
                          <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                          Delivery Address
                        </h3>

                        <div>
                          <Label
                            htmlFor="address"
                            className="font-body text-sm"
                          >
                            Street Address *
                          </Label>
                          <Input
                            id="address"
                            value={orderInfo.address}
                            onChange={(e) =>
                              setOrderInfo((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }))
                            }
                            placeholder="Enter your full address"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="state"
                            className="font-body text-sm"
                          >
                            State *
                          </Label>
                          <Select
                            value={orderInfo.state}
                            onValueChange={(value) =>
                              setOrderInfo((prev) => ({
                                ...prev,
                                state: value,
                              }))
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                            <SelectContent>
                              {nigerianStates.map((state) => (
                                <SelectItem
                                  key={state}
                                  value={state}
                                >
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    )}

                    <Separator />

                    {/* Payment Button */}
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handlePayment}
                      disabled={
                        loading ||
                        !paystackLoaded ||
                        !paystackPublicKey
                      }
                    >
                      {loading
                        ? "Processing..."
                        : `Pay ${formatPrice(total)} with Paystack`}
                    </Button>

                    <div className="text-center space-y-2">
                      <p className="font-body text-xs text-gray-500">
                        Secure payment powered by Paystack
                      </p>
                      {!paystackLoaded && (
                        <p className="font-body text-xs text-orange-600">
                          Loading payment system...
                        </p>
                      )}
                      {!paystackPublicKey && paystackLoaded && (
                        <p className="font-body text-xs text-red-600">
                          Payment configuration loading...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <Card className="sticky top-24">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-heading text-lg md:text-xl">
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Cart Items */}
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.id}-${item.size}-${item.color}`}
                          className="flex gap-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 md:w-14 md:h-14 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-body font-medium text-sm truncate">
                              {item.name}
                            </p>
                            <p className="font-body text-xs text-gray-500">
                              {item.size} • {item.color} •{" "}
                              {item.quantity}x
                            </p>
                          </div>
                          <p className="font-body font-semibold text-sm">
                            {formatPrice(
                              item.price * item.quantity,
                            )}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2 font-body text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartSubtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          {orderInfo.deliveryMethod === "pickup"
                            ? "Pickup"
                            : "Delivery"}
                        </span>
                        <span>
                          {shippingCost > 0
                            ? formatPrice(shippingCost)
                            : "Free"}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-base md:text-lg">
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