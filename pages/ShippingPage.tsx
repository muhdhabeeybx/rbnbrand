import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, MapPin, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export function ShippingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 p-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6" />
            <h1 className="font-heading text-4xl">Shipping Information</h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl">
            Everything you need to know about our shipping process and delivery options.
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black text-white p-8 mb-12"
        >
          <h3 className="font-heading text-xl mb-4">Important Notice</h3>
          <p className="text-lg">
            Delivery charges are not calculated on the website. Shipping costs will be communicated 
            at the point of dispatch based on your location and order size.
          </p>
        </motion.div>

        {/* Shipping Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="font-heading text-2xl mb-8">Shipping Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-medium text-lg mb-2">Order Processing</h3>
              <p className="text-gray-600">
                Orders are processed within 1-2 business days after confirmation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-medium text-lg mb-2">Dispatch</h3>
              <p className="text-gray-600">
                You'll receive dispatch notification with tracking details and shipping cost.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-medium text-lg mb-2">Delivery</h3>
              <p className="text-gray-600">
                Track your order and receive it at your doorstep within estimated timeframe.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Delivery Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="font-heading text-2xl mb-6">Delivery Areas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5" />
                <h3 className="font-medium text-lg">Domestic Delivery</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><strong>Lagos:</strong> 1-3 business days</p>
                <p><strong>Abuja & Port Harcourt:</strong> 2-4 business days</p>
                <p><strong>Other major cities:</strong> 3-7 business days</p>
                <p><strong>Remote areas:</strong> 5-10 business days</p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5" />
                <h3 className="font-medium text-lg">International Delivery</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><strong>West Africa:</strong> 7-14 business days</p>
                <p><strong>USA & Europe:</strong> 14-21 business days</p>
                <p><strong>Rest of World:</strong> 21-28 business days</p>
                <p className="text-sm text-gray-500">
                  *International customers are responsible for customs duties and taxes.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="font-heading text-2xl mb-6">Order Tracking</h2>
          <div className="bg-gray-50 p-6 space-y-4">
            <p className="text-gray-700">
              Once your order is dispatched, you'll receive:
            </p>
            <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
              <li>Email notification with tracking number</li>
              <li>SMS updates on delivery status</li>
              <li>Access to real-time tracking via courier website</li>
              <li>Delivery confirmation upon receipt</li>
            </ul>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h3 className="font-heading text-xl mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            Have questions about shipping? Our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
            <Button variant="outline" onClick={() => navigate('/faq')}>
              View FAQ
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}