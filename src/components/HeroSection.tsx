import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1736712957897-b54ce0bbfdee?auto=format&fit=crop&q=80&w=1920"
          alt="Editorial fashion model"
          className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-[4000ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-light tracking-[0.15em] uppercase mb-6">
          RAIN <span className="text-white/50">by</span> NURAIN
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="text-base md:text-xl lg:text-2xl font-extralight tracking-[0.25em] uppercase mb-12 text-white/80"
        >
          Left Home to Feed Home
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-neutral-200 px-10 py-4 text-base font-light rounded-full transition-all duration-300"
          >
            Shop Collection
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/70 text-white hover:bg-white hover:text-black px-10 py-4 text-base font-light rounded-full transition-all duration-300"
          >
            Discover the Story
          </Button>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white"
      >
        <div className="flex flex-col items-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-3">Scroll</span>
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-10 bg-white/40"
          />
        </div>
      </motion.div>
    </section>
  );
}
