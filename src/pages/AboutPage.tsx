import React from 'react';
import { Heart, Globe, Users, Zap, Target, Star, Award, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { icon: Users, label: 'Happy Customers', value: '50K+' },
  { icon: Globe, label: 'Countries', value: '25+' },
  { icon: Award, label: 'Awards Won', value: '12' },
  { icon: Truck, label: 'Orders Shipped', value: '100K+' },
];

const values = [
  {
    icon: Heart,
    title: 'Passion-Driven',
    description: 'Every design comes from the heart, inspired by real stories and authentic experiences.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Connecting cultures and communities through fashion that transcends boundaries.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop'
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Building a movement where everyone belongs and every voice matters.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Pushing creative boundaries while staying true to our streetwear roots.',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=400&fit=crop'
  },
];

const timeline = [
  {
    year: '2020',
    title: 'The Beginning',
    description: 'Started with a vision to create authentic streetwear that tells stories.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  {
    year: '2021',
    title: 'First Collection',
    description: 'Launched our debut collection "Left Home to Feed Home" to critical acclaim.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
  },
  {
    year: '2022',
    title: 'Global Expansion',
    description: 'Expanded to 15 countries, bringing our message worldwide.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop'
  },
  {
    year: '2024',
    title: 'Today',
    description: 'Leading the next generation of conscious streetwear with purpose.',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=300&fit=crop'
  },
];

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-gray-400" />
                <span className="text-product-category text-gray-500 uppercase tracking-wider">
                  Our Mission
                </span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-8">
                Left Home to Feed Home
              </h1>
              <p className="font-body text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                We are more than a streetwear brand. We are a movement for dreamers, creators, 
                and those brave enough to leave everything behind in pursuit of something greater. 
                Every thread tells a story of ambition, sacrifice, and the relentless pursuit of success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/shop')}>
                  Shop Collection
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/community')}>
                  Join Community
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gray-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=750&fit=crop"
                  alt="RBN founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-lg max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold">
                    R
                  </div>
                  <div>
                    <p className="font-body font-semibold">Rain by Nurain</p>
                    <p className="font-body text-gray-600 text-sm">Founder & Creative Director</p>
                  </div>
                </div>
                <p className="font-body text-sm text-gray-600 italic">
                  "Every design is a piece of my journey, shared with the world."
                </p>
              </div>
            </motion.div>
          </div>
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

      {/* Values Section */}
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
              Our Values
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              These principles guide everything we do, from design to delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-body text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="font-body text-gray-600 leading-relaxed mb-4">{value.description}</p>
                  </div>
                </div>
                <div className="aspect-[16/9] bg-gray-200 overflow-hidden mt-6">
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
              Our Journey
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From humble beginnings to global recognition, here's how we've grown.
            </p>
          </motion.div>

          <div className="space-y-16">
            {timeline.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-heading text-lg">
                      {milestone.year}
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl">{milestone.title}</h3>
                  </div>
                  <p className="font-body text-lg text-gray-600 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
              Join the Movement
            </h2>
            <p className="font-body text-lg md:text-xl leading-relaxed mb-10 text-gray-300">
              Be part of a community that celebrates individuality, embraces creativity, 
              and never stops pushing boundaries. Your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/shop')}
                className="bg-white text-black hover:bg-gray-100"
              >
                Shop Collection
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/community')}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Join Community
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}