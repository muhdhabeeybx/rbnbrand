import React from 'react';
import { Instagram, Twitter, Video } from 'lucide-react';

export function CommunityPage() {
  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl mb-6 tracking-tight">COMMUNITY</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join the movement. Share your story. Feed the home.
          </p>
        </div>

        {/* Social Links */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <a href="#" className="group bg-black text-white p-8 rounded-2xl hover:bg-gray-900 transition-colors">
            <Instagram className="w-8 h-8 mb-4" />
            <h3 className="text-xl mb-2">@rainbynurain</h3>
            <p className="text-gray-300 text-sm">Daily fits, behind the scenes, and community features</p>
          </a>
          <a href="#" className="group bg-black text-white p-8 rounded-2xl hover:bg-gray-900 transition-colors">
            <Twitter className="w-8 h-8 mb-4" />
            <h3 className="text-xl mb-2">@rbn_official</h3>
            <p className="text-gray-300 text-sm">Brand updates, community conversations, and drops</p>
          </a>
          <a href="#" className="group bg-black text-white p-8 rounded-2xl hover:bg-gray-900 transition-colors">
            <Video className="w-8 h-8 mb-4" />
            <h3 className="text-xl mb-2">@rainbynurain</h3>
            <p className="text-gray-300 text-sm">Style challenges, brand stories, and viral moments</p>
          </a>
        </div>

        {/* Community Guidelines */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8 text-center">Community Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl mb-4">Be Authentic</h3>
              <p className="text-gray-700 text-sm">
                Share your real story. Whether you're grinding, winning, or learning - 
                authenticity is what connects us all.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl mb-4">Lift Each Other</h3>
              <p className="text-gray-700 text-sm">
                Support fellow community members. Celebrate wins, offer encouragement, 
                and help others grow.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl mb-4">Stay Creative</h3>
              <p className="text-gray-700 text-sm">
                Show us how you style RBN pieces. Creative content and unique perspectives 
                make our community stronger.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl mb-4">Respect the Journey</h3>
              <p className="text-gray-700 text-sm">
                Everyone's path is different. Respect diverse backgrounds, experiences, 
                and perspectives within our community.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Community */}
        <div className="text-center">
          <h2 className="text-4xl mb-8">Featured Community</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-gray-400 text-sm">@USER{i}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 mb-8">
            Tag us @rainbynurain to be featured
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-900 transition-colors">
            JOIN THE COMMUNITY
          </button>
        </div>
      </div>
    </main>
  );
}