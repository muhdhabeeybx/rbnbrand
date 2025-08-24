import React from 'react';

export function AboutPage() {
  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl mb-6 tracking-tight">ABOUT RBN</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Left Home to Feed Home
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-3xl mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Rain by Nurain (RBN) was born from a simple truth: sometimes you have to leave 
                everything behind to build something meaningful for the people you love.
              </p>
              <p>
                Our founder's journey from leaving home to creating a brand that feeds back into 
                the community embodies the spirit of sacrifice, determination, and hope that defines 
                our generation.
              </p>
              <p>
                Every piece we create carries this story forward - bold, uncompromising designs 
                for those who understand that true success means lifting others up with you.
              </p>
            </div>
          </div>
          <div className="bg-gray-100 aspect-square rounded-2xl flex items-center justify-center">
            <span className="text-gray-400 text-sm">BRAND IMAGE</span>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <h3 className="text-xl mb-4">AUTHENTIC</h3>
            <p className="text-gray-600 text-sm">
              Every design reflects real experiences and genuine emotions of our community.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl mb-4">PURPOSEFUL</h3>
            <p className="text-gray-600 text-sm">
              We create with intention, ensuring each piece serves both style and story.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl mb-4">COMMUNITY</h3>
            <p className="text-gray-600 text-sm">
              Success is measured by how we uplift and support each other.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="text-center bg-black text-white p-16 rounded-2xl">
          <h2 className="text-4xl mb-6">Our Mission</h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-200">
            To create premium streetwear that tells the stories of ambition, sacrifice, and 
            community - proving that when you chase your dreams with purpose, everyone wins.
          </p>
        </div>
      </div>
    </main>
  );
}