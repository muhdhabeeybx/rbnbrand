import React from 'react';
import { Heart, Globe, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: Heart,
    title: 'Crafted with Love',
    description: 'Every piece is carefully designed and crafted with attention to detail and quality.'
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Connecting streetwear enthusiasts from all corners of the world.'
  },
  {
    icon: Users,
    title: 'For the Culture',
    description: 'Supporting artists, creators, and those who dare to express themselves.'
  },
  {
    icon: Zap,
    title: 'Always Evolving',
    description: 'Constantly pushing boundaries and setting new trends in streetwear.'
  }
];

export function StorySection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-16 lg:p-20 shadow-sm border border-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mobile-keep-center mb-20"
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-8 tracking-tight">
              Our Story
            </h2>
            <p className="font-body text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Born from the streets, crafted for the culture. RBN represents more than just clothing—
              it's a movement for those who left home to feed home, who chase dreams against all odds.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center mobile-keep-center"
              >
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-body text-lg font-semibold mb-4 tracking-tight">{feature.title}</h3>
                <p className="font-body text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Quote Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mobile-keep-center border-t border-gray-200 pt-16"
          >
            <blockquote className="font-heading text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-8 max-w-4xl mx-auto">
              "Fashion is not just about what you wear—it's about who you become when you wear it."
            </blockquote>
            <div className="flex items-center justify-center gap-4 mobile-keep-center">
              <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-bold">
                R
              </div>
              <div className="text-left">
                <p className="font-body font-semibold">Rain by Nurain</p>
                <p className="font-body text-gray-600 text-sm">Founder & Creative Director</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}