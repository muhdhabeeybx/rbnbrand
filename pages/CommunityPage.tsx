import React from 'react';
import { Instagram, Twitter, Video, Users, Heart, Share2, Camera, MessageCircle, Star, Globe, Target, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const socialPlatforms = [
  {
    icon: Instagram,
    name: 'Instagram',
    handle: '@rainbynurain',
    description: 'Daily fits, behind the scenes, and community features',
    followers: '125K',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    href: '#'
  },
  {
    icon: Twitter,
    name: 'Twitter',
    handle: '@rbn_official',
    description: 'Brand updates, community conversations, and drops',
    followers: '67K',
    color: 'bg-blue-500',
    href: '#'
  },
  {
    icon: Video,
    name: 'TikTok',
    handle: '@rainbynurain',
    description: 'Style challenges, brand stories, and viral moments',
    followers: '89K',
    color: 'bg-black',
    href: '#'
  }
];

const guidelines = [
  {
    icon: Heart,
    title: 'Be Authentic',
    description: 'Share your real story. Whether you\'re grinding, winning, or learning - authenticity is what connects us all.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
  },
  {
    icon: Users,
    title: 'Lift Each Other',
    description: 'Support fellow community members. Celebrate wins, offer encouragement, and help others grow.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop'
  },
  {
    icon: Camera,
    title: 'Stay Creative',
    description: 'Show us how you style RBN pieces. Creative content and unique perspectives make our community stronger.',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=400&fit=crop'
  },
  {
    icon: Globe,
    title: 'Respect the Journey',
    description: 'Everyone\'s path is different. Respect diverse backgrounds, experiences, and perspectives within our community.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop'
  }
];

const featuredPosts = [
  {
    id: 1,
    user: '@streetstyle_maven',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    likes: 234,
    caption: 'RBN hoodie hitting different in the city ✨ #LeftHomeToFeedHome'
  },
  {
    id: 2,
    user: '@urban_explorer',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    likes: 189,
    caption: 'Midnight drops with the crew 🔥 @rainbynurain'
  },
  {
    id: 3,
    user: '@fashion_forward',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop',
    likes: 312,
    caption: 'That RBN fit just hits different 💯'
  },
  {
    id: 4,
    user: '@creative_soul',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=400&fit=crop',
    likes: 156,
    caption: 'New drops, new energy ⚡ #RBNCommunity'
  },
  {
    id: 5,
    user: '@style_curator',
    image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400&h=400&fit=crop',
    likes: 278,
    caption: 'Living the RBN lifestyle 🖤'
  },
  {
    id: 6,
    user: '@streetwear_enthusiast',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    likes: 201,
    caption: 'From the streets to the stage 🎤 #RainByNurain'
  }
];

const stats = [
  { icon: Users, label: 'Community Members', value: '250K+' },
  { icon: Instagram, label: 'Social Followers', value: '281K+' },
  { icon: Share2, label: 'User Generated Posts', value: '50K+' },
  { icon: Star, label: 'Featured Creators', value: '1.2K+' }
];

export function CommunityPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Target className="w-5 h-5 text-gray-400" />
              <span className="text-product-category text-gray-500 uppercase tracking-wider">
                Join the Movement
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-8">
              RBN Community
            </h1>
            <p className="font-body text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Join the movement. Share your story. Feed the home. Connect with creatives, 
              dreamers, and hustlers from around the world who understand the journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                <Users className="w-5 h-5 mr-3" />
                Join Community
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/shop')}>
                <Zap className="w-5 h-5 mr-3" />
                Shop Collection
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="font-heading text-3xl md:text-4xl mb-2">{stat.value}</div>
                <div className="font-body text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Platforms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6">
              Follow the Movement
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Stay connected across all platforms for the latest drops, community features, and behind-the-scenes content.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialPlatforms.map((platform, index) => (
              <motion.a
                key={platform.name}
                href={platform.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 border hover:border-gray-300"
              >
                <div className={`w-16 h-16 ${platform.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <platform.icon className="w-8 h-8" />
                </div>
                <h3 className="font-body text-xl font-semibold mb-2">{platform.name}</h3>
                <p className="font-body text-lg text-gray-900 mb-2">{platform.handle}</p>
                <p className="font-body text-gray-600 mb-4 leading-relaxed">{platform.description}</p>
                <Badge variant="secondary" className="font-body">
                  {platform.followers} followers
                </Badge>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6">
              Community Guidelines
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              These principles keep our community strong, supportive, and authentic.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={guideline.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-8 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center flex-shrink-0">
                    <guideline.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-body text-xl font-semibold mb-3">{guideline.title}</h3>
                    <p className="font-body text-gray-600 leading-relaxed">{guideline.description}</p>
                  </div>
                </div>
                <div className="aspect-[16/9] bg-gray-200 overflow-hidden">
                  <img
                    src={guideline.image}
                    alt={guideline.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Community - Instagram Feed */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6">
              Featured Community
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              See how our community styles RBN pieces and shares their journey. Tag us <strong>@rainbynurain</strong> to be featured.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group relative aspect-square bg-gray-200 overflow-hidden cursor-pointer"
              >
                <img
                  src={post.image}
                  alt={`Community post by ${post.user}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center px-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart className="w-4 h-4" />
                      <span className="font-body text-sm">{post.likes}</span>
                    </div>
                    <p className="font-body text-xs">{post.user}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Button size="lg" className="px-8">
              <Instagram className="w-5 h-5 mr-3" />
              Follow @rainbynurain
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-8">
              Ready to Join?
            </h2>
            <p className="font-body text-lg md:text-xl leading-relaxed mb-10 text-gray-300">
              Become part of a community that celebrates authenticity, creativity, and the hustle. 
              Your story matters. Your journey inspires. Let's grow together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-black hover:bg-gray-100"
              >
                <Users className="w-5 h-5 mr-3" />
                Join Community
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/shop')}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                <Zap className="w-5 h-5 mr-3" />
                Shop Collection
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}