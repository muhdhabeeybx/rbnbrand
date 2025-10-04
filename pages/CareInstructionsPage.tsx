import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shirt, Droplets, Sun, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export function CareInstructionsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 p-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <Shirt className="w-6 h-6" />
            <h1 className="font-heading text-4xl">Care Instructions</h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl">
            Keep your RBN pieces looking fresh with proper care. Follow these guidelines to maintain quality and longevity.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Droplets className="w-8 h-8 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-lg mb-2">Washing</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Machine wash cold (30°C/86°F max)</li>
                    <li>• Turn garments inside out</li>
                    <li>• Use mild detergent</li>
                    <li>• Wash with similar colors</li>
                    <li>• Avoid bleach and fabric softeners</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Sun className="w-8 h-8 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-medium text-lg mb-2">Drying</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Air dry when possible</li>
                    <li>• Lay flat or hang to dry</li>
                    <li>• Avoid direct sunlight</li>
                    <li>• If using dryer, use low heat</li>
                    <li>• Remove while slightly damp</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Settings className="w-8 h-8 text-gray-600 mt-1" />
                <div>
                  <h3 className="font-medium text-lg mb-2">Ironing</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Iron inside out to protect prints</li>
                    <li>• Use medium heat setting</li>
                    <li>• Avoid ironing directly on graphics</li>
                    <li>• Steam if needed for wrinkles</li>
                    <li>• Hang immediately after ironing</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Shirt className="w-8 h-8 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-medium text-lg mb-2">Storage</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Fold or hang properly</li>
                    <li>• Store in cool, dry place</li>
                    <li>• Avoid overcrowding</li>
                    <li>• Keep away from direct light</li>
                    <li>• Use cedar blocks for freshness</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-black text-white p-8 mb-12">
          <h3 className="font-heading text-xl mb-4">Special Care for Graphics</h3>
          <p className="text-lg mb-4">Our printed designs require extra attention:</p>
          <ul className="space-y-2 text-gray-300">
            <li>• Always wash inside out</li>
            <li>• Never iron directly on prints</li>
            <li>• Air dry when possible</li>
            <li>• Avoid harsh chemicals</li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
          <h3 className="font-heading text-xl mb-4">Need More Help?</h3>
          <p className="text-gray-600 mb-6">
            Have specific questions about caring for your RBN pieces?
          </p>
          <Button onClick={() => navigate('/contact')}>Contact Support</Button>
        </motion.div>
      </div>
    </div>
  );
}