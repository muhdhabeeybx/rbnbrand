import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export function ReturnsPage() {
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
            <RotateCcw className="w-6 h-6" />
            <h1 className="font-heading text-4xl">Returns & Exchanges</h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl">
            We want you to love your RBN pieces. If something isn't quite right, we're here to help.
          </p>
        </motion.div>

        {/* Return Policy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="font-heading text-2xl mb-6">Return Policy</h2>
          <div className="bg-black text-white p-8 mb-8">
            <h3 className="font-heading text-xl mb-4">30-Day Return Window</h3>
            <p className="text-lg">
              You have 30 days from the date of delivery to return items for a full refund or exchange.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">What We Accept</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Items in original condition</li>
                  <li>Tags still attached</li>
                  <li>No signs of wear</li>
                  <li>Original packaging</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">What We Don't Accept</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Worn or damaged items</li>
                  <li>Items without tags</li>
                  <li>Custom or personalized items</li>
                  <li>Sale items (final sale)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">Special Cases</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Defective items: Full refund</li>
                  <li>Wrong size sent: Free exchange</li>
                  <li>Damaged in transit: Full refund</li>
                  <li>Quality issues: Full refund</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Return Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="font-heading text-2xl mb-8">How to Return</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium mb-2">Contact Us</h4>
                <p className="text-gray-600">
                  Reach out to our customer service team to initiate your return. We'll provide you with a return authorization number.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium mb-2">Package Your Item</h4>
                <p className="text-gray-600">
                  Pack the item in its original condition with all tags attached. Include your return authorization number.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium mb-2">Ship It Back</h4>
                <p className="text-gray-600">
                  Send the package to our returns address. We recommend using a trackable shipping method.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-medium mb-2">Get Your Refund</h4>
                <p className="text-gray-600">
                  Once we receive and inspect your return, we'll process your refund within 5-7 business days.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Return Address */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="font-heading text-2xl mb-6">Return Address</h2>
          <div className="bg-gray-50 p-6">
            <div className="font-medium mb-2">Rain by Nurain Returns</div>
            <div className="text-gray-700 space-y-1">
              <div>[Return Address Line 1]</div>
              <div>[Return Address Line 2]</div>
              <div>[City, State, ZIP Code]</div>
              <div>[Country]</div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Please include your return authorization number with your package
            </p>
          </div>
        </motion.div>

        {/* Exchange Policy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="font-heading text-2xl mb-6">Exchanges</h2>
          <div className="bg-gray-50 p-6 space-y-4">
            <p className="text-gray-700">
              Need a different size or color? We offer free exchanges within 30 days of delivery.
            </p>
            <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
              <li>Follow the same return process above</li>
              <li>Specify the item you'd like to exchange for</li>
              <li>We'll ship your new item once we receive the return</li>
              <li>No additional shipping charges for size exchanges</li>
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
          <h3 className="font-heading text-xl mb-4">Questions About Returns?</h3>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to help make your return process smooth and easy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
            <Button variant="outline" onClick={() => navigate('/shipping')}>
              Shipping Info
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}