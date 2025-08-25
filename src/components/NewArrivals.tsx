import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { ProductCard } from './ProductCard';
import { motion } from 'motion/react';
import { useApp } from '../contexts/AppContext';

export function NewArrivals() {
  const { products } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Safety check - ensure products is an array and has items
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <section id="new-arrivals" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6">
              New Arrivals
            </h2>
            <p className="font-body text-lg text-gray-600">
              Products are loading...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Get max 8 products and mark them as new
  const newProducts = products.slice(0, 8).map(product => ({
    ...product,
    isNew: true
  }));

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one card plus gap
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="new-arrivals" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gray-400" />
            <span className="text-product-category text-gray-500 uppercase tracking-wider">
              Fresh Drops
            </span>
            <Sparkles className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6">
            New Arrivals
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the latest additions to our collection. Each piece tells a story, crafted for those who dare to stand out.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute -top-16 right-0 flex gap-2 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('left')}
              className="w-10 h-10 p-0 border-gray-300 hover:border-gray-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('right')}
              className="w-10 h-10 p-0 border-gray-300 hover:border-gray-400"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Products Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {newProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-none w-[280px] md:w-[320px]"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Scroll indicator dots */}
          {newProducts.length > 4 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(newProducts.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  className="w-2 h-2 bg-gray-300 hover:bg-gray-400 transition-colors"
                  onClick={() => {
                    if (scrollRef.current) {
                      const scrollAmount = 320 * 4; // 4 cards width
                      scrollRef.current.scrollTo({
                        left: scrollAmount * index,
                        behavior: 'smooth'
                      });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS for hiding scrollbar - using global styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
    </section>
  );
}