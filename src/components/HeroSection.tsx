import React from 'react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import heroImage from 'figma:asset/c922304097c6f9a7539b65c3c055f048138f4c6b.png';

export function HeroSection() {
  const scrollToNewArrivals = () => {
    const newArrivalsSection = document.getElementById('new-arrivals');
    if (newArrivalsSection) {
      newArrivalsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Left Home to Feed Home
          </h1>
          <p className="font-body text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-white/90">
            Discover our latest collection of premium streetwear that tells your story
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={scrollToNewArrivals}
              className="bg-white text-black hover:bg-gray-100 font-medium tracking-wide px-12 py-4 text-base uppercase"
            >
              Shop Now
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <p className="text-xs uppercase tracking-wider mb-2 font-body">Scroll</p>
          <div className="w-px h-8 bg-white/50"></div>
        </div>
      </motion.div>
    </section>
  );
}