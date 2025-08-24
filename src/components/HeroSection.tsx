import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1736712957897-b54ce0bbfdee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbW9kZWwlMjBzdHJlZXQlMjBzdHlsZXxlbnwxfHx8fDE3NTU4OTUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1920"
          alt="Editorial fashion model"
          className="w-full h-full object-cover opacity-70 scale-105 transition-transform duration-[3000ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-extrabold tracking-tight leading-none mb-6">
          RAIN <span className="text-white/60">BY</span> NURAIN
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-lg md:text-2xl lg:text-3xl font-light uppercase tracking-[0.2em] mb-10"
        >
          Left Home to Feed Home
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-100 px-10 py-4 text-lg font-medium rounded-full shadow-md transition"
          >
            Shop Collection
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:text-black px-10 py-4 text-lg font-medium rounded-full transition"
          >
            Discover the Story
          </Button>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white"
      >
        <div className="flex flex-col items-center">
          <span className="text-xs mb-2 tracking-widest uppercase">Scroll</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-white/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
