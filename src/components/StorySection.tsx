import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function StorySection() {
  return (
    <section className="flex justify-center items-center py-16 px-4">
      <div className="w-full max-w-6xl bg-black rounded-2xl overflow-hidden shadow-xl flex flex-col lg:flex-row">
        
        {/* Text content */}
        <div className="flex-1 text-white p-8 lg:p-16 flex items-center">
          <div className="max-w-lg mx-auto lg:mx-0">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
              Left Home to Feed Home
            </h2>
            <p className="text-base lg:text-lg mb-6 leading-relaxed opacity-90">
              Every stitch tells a story. Every piece carries purpose. 
              Rain by Nurain was born from the hustle, crafted for those 
              who understand that style is more than fashion—it's identity.
            </p>
            <p className="text-sm lg:text-base mb-8 leading-relaxed opacity-75">
              From the streets to the world stage, we represent the dreamers, 
              the builders, the ones who left home not to forget it, but to 
              elevate it. This is streetwear with soul.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black transition"
            >
              Read More →
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1671124946820-717383307326?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwcG9ydHJhaXQlMjBmb3VuZGVyJTIwZW50cmVwcmVuZXVyfGVufDF8fHx8MTc1NTkzODUyN3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Nurain - Founder"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 text-white bg-black/50 px-3 py-2 rounded-lg">
            <p className="text-sm font-medium">Nurain</p>
            <p className="text-xs opacity-80">Founder & Creative Director</p>
          </div>
        </div>
      </div>
    </section>
  );
}
