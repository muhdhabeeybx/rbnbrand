import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ruler } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export function SizeGuidePage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sizeData = [
    { size: 'XS', length: '27 in.', width: '20 in.', sleeve: '7 1/2 in.' },
    { size: 'S', length: '28 in.', width: '21 1/2 in.', sleeve: '8 in.' },
    { size: 'M', length: '29 in.', width: '23 in.', sleeve: '8 1/2 in.' },
    { size: 'L', length: '30 in.', width: '24 1/2 in.', sleeve: '9 in.' },
    { size: 'XL', length: '31 in.', width: '26 in.', sleeve: '9 1/2 in.' },
    { size: 'XXL', length: '32 in.', width: '27 1/2 in.', sleeve: '10 in.' },
  ];

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
            <Ruler className="w-6 h-6" />
            <h1 className="font-heading text-4xl">Size Guide</h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl">
            Find your perfect fit with our comprehensive size guide. All measurements are in inches.
          </p>
        </motion.div>

        {/* Size Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-gray-300 px-6 py-4 text-left font-medium">Size</th>
                  <th className="border border-gray-300 px-6 py-4 text-left font-medium">Length</th>
                  <th className="border border-gray-300 px-6 py-4 text-left font-medium">Width</th>
                  <th className="border border-gray-300 px-6 py-4 text-left font-medium">Sleeve</th>
                </tr>
              </thead>
              <tbody>
                {sizeData.map((row, index) => (
                  <tr key={row.size} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 px-6 py-4 font-medium">{row.size}</td>
                    <td className="border border-gray-300 px-6 py-4">{row.length}</td>
                    <td className="border border-gray-300 px-6 py-4">{row.width}</td>
                    <td className="border border-gray-300 px-6 py-4">{row.sleeve}</td>
                  </tr>
                ))}
                <tr className="bg-black text-white">
                  <td className="border border-gray-300 px-6 py-4 font-medium">One Size Fits All</td>
                  <td className="border border-gray-300 px-6 py-4" colSpan={3}>
                    Designed to fit sizes S-L comfortably
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black text-white p-8 mb-12"
        >
          <h3 className="font-heading text-xl mb-4">Important Note</h3>
          <p className="text-lg">
            <strong>ALL TEES ARE SLIGHTLY OVERSIZED</strong>
          </p>
          <p className="text-gray-300 mt-2">
            Our tees are designed with a relaxed, contemporary fit that's perfect for street style.
          </p>
        </motion.div>

        {/* Measuring Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div>
            <h3 className="font-heading text-xl mb-4">How to Measure</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <strong>Length:</strong> Measure from the highest point of the shoulder to the bottom hem.
              </div>
              <div>
                <strong>Width:</strong> Measure across the chest from armpit to armpit.
              </div>
              <div>
                <strong>Sleeve:</strong> Measure from the shoulder seam to the end of the sleeve.
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading text-xl mb-4">Fit Guide</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <strong>Oversized Fit:</strong> Relaxed and roomy for a modern streetwear look.
              </div>
              <div>
                <strong>Drop Shoulder:</strong> Shoulder seam sits lower than natural shoulder line.
              </div>
              <div>
                <strong>Boxy Cut:</strong> Straight silhouette that doesn't taper at the waist.
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Still not sure about sizing? Contact our team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
            <Button variant="outline" onClick={() => navigate('/shop')}>
              Shop Now
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}