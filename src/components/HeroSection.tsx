import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import HeroBg from "../RBN-Hero.jpg";

export function HeroSection() {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate("/shop");
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={HeroBg}
          alt="Rain by Nurain streetwear hero"
          className="w-full h-full object-cover opacity-70 scale-105 transition-transform duration-[4000ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Hero Title */}
        <h1 className="font-serif font-normal text-[42px] sm:text-[55px] md:text-[65px] lg:text-[75px] xl:text-[85px] leading-tight tracking-tight text-white mb-8">
  Left Home to Feed Home
</h1>

<motion.p
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 1.2 }}
  className="font-sans text-base md:text-lg lg:text-xl leading-relaxed text-slate-300 max-w-3xl mx-auto px-6"
>
  Rain by Nurain — Nigerian streetwear for dreamers and doers who carry home wherever they go.
</motion.p>

<div className="flex justify-center mt-10">
  <Button
    size="lg"
    onClick={handleShopClick}
    className="bg-white text-black hover:bg-neutral-200 px-6 md:px-8 py-4 text-base rounded-[4px] transition-all duration-300"
  >
    Start Shopping
  </Button>
</div>

        {/* Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleShopClick}
            className="bg-white text-black hover:bg-neutral-200 px-6 py-4 text-base rounded-none transition-all duration-300"
          >
            Start Shopping
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
