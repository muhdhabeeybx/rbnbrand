import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Instagram, Twitter, Music } from "lucide-react";

export function CommunitySection() {
  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Community CTA */}
        <div className="mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Wear the Movement.<br />
            Join the Tribe.
          </h2>
          <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Connect with a global community of creators, hustlers, and dreamers. 
            Share your story, inspire others, and be part of something bigger.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg"
          >
            Join Community →
          </Button>
        </div>

        {/* Social media */}
        <div className="mb-16">
          <p className="text-sm uppercase tracking-wide mb-6 opacity-75">Follow the Movement</p>
          <div className="flex justify-center space-x-6">
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <Instagram className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <Twitter className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <Music className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/20 pt-16">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">Stay in the Rain</h3>
          <p className="text-base lg:text-lg mb-8 opacity-75 max-w-xl mx-auto">
            Be the first to know about new drops, exclusive access, and stories from the community.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-white/30 text-white placeholder-white/50 focus:border-white"
              />
              <Button className="bg-white text-black hover:bg-gray-100 px-6">
                Subscribe
              </Button>
            </div>
            <p className="text-xs mt-3 opacity-50">
              No spam, just the essentials. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}