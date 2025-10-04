import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, Camera, Palette, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { unsplash_tool } from '../utils/unsplash';

const editorialFeatures = [
  {
    icon: Camera,
    title: 'Editorial Photography',
    description: 'Capturing authentic moments and real stories from our community.'
  },
  {
    icon: Palette,
    title: 'Creative Direction',
    description: 'Bold visuals that challenge conventions and inspire individuality.'
  },
  {
    icon: TrendingUp,
    title: 'Trend Setting',
    description: 'Leading the culture, not following it. Setting tomorrow\'s standards today.'
  }
];

export function LifestyleEditorial() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 p-8 md:p-16 lg:p-20 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-12">
                <span className="text-product-category text-gray-500 uppercase tracking-wider">
                  Lifestyle
                </span>
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mt-6 mb-8 tracking-tight">
                  More Than Fashion
                </h2>
                <p className="font-body text-lg text-gray-600 leading-relaxed mb-8">
                  Dive into our world where fashion meets art, where every piece tells a story, 
                  and where individuality is celebrated. This is lifestyle reimagined.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-8 mb-12">
                {editorialFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-body font-semibold mb-3 tracking-tight">{feature.title}</h3>
                      <p className="font-body text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => navigate('/community')}
                className="group"
              >
                Explore Community
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Images Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="aspect-[4/5] bg-gray-200 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop"
                    alt="Fashion editorial 1"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square bg-gray-200 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop"
                    alt="Fashion editorial 2"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="aspect-square bg-gray-200 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=400&fit=crop"
                    alt="Fashion editorial 3"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[4/5] bg-gray-200 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop"
                    alt="Fashion editorial 4"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}