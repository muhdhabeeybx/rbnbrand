import React, { useState } from 'react';
import { Mail, MessageSquare, Package, ArrowRight, CheckCircle, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send customer inquiry notification
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f3098dc/notifications/send-customer-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: 'general',
            message: ''
          });
          setIsSubmitted(false);
        }, 3000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="pt-32 pb-32 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h1 className="font-heading text-5xl md:text-7xl mb-8 tracking-tight text-black">
            Contact
          </h1>
          <div className="h-px w-32 bg-black mx-auto mb-8" />
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions? Need support? Want to collaborate? We're here to help.
            Reach out and let's start a conversation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-24 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-12">
              <h2 className="font-heading text-3xl mb-4 text-black">Get in Touch</h2>
              <p className="text-gray-600">Send us a message and we'll get back to you as soon as possible.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block mb-3 text-black font-medium uppercase tracking-wide text-sm">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 bg-white focus:outline-none focus:border-black transition-all duration-200 hover:border-gray-400"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-3 text-black font-medium uppercase tracking-wide text-sm">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 bg-white focus:outline-none focus:border-black transition-all duration-200 hover:border-gray-400"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block mb-3 text-black font-medium uppercase tracking-wide text-sm">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 bg-white focus:outline-none focus:border-black transition-all duration-200 hover:border-gray-400"
                  disabled={isSubmitting}
                >
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="press">Press & Media</option>
                  <option value="collaboration">Collaboration</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-3 text-black font-medium uppercase tracking-wide text-sm">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full p-4 border border-gray-200 bg-white focus:outline-none focus:border-black transition-all duration-200 hover:border-gray-400 resize-none"
                  placeholder="Tell us what's on your mind..."
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="w-full bg-black text-white p-4 font-medium uppercase tracking-wide text-sm transition-all duration-200 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:pl-8"
          >
            <div className="mb-12">
              <h2 className="font-heading text-3xl mb-4 text-black">Other Ways to Reach Us</h2>
              <p className="text-gray-600">Choose the method that works best for you.</p>
            </div>
            
            <div className="space-y-8">
              <motion.div 
                whileHover={{ y: -2 }}
                className="group"
              >
                <div className="flex items-start gap-6 p-8 border border-gray-200 transition-all duration-200 hover:border-black">
                  <div className="w-12 h-12 bg-black flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 uppercase tracking-wide text-sm">Email Support</h3>
                    <p className="text-gray-600 mb-3 text-sm">For general inquiries and support</p>
                    <a 
                      href="mailto:support@rainbynurain.com" 
                      className="text-black hover:text-gray-600 transition-colors font-medium"
                    >
                      support@rainbynurain.com
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -2 }}
                className="group"
              >
                <div className="flex items-start gap-6 p-8 border border-gray-200 transition-all duration-200 hover:border-black">
                  <div className="w-12 h-12 bg-black flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 uppercase tracking-wide text-sm">Order Support</h3>
                    <p className="text-gray-600 mb-3 text-sm">Questions about your order or shipping</p>
                    <a 
                      href="mailto:orders@rainbynurain.com" 
                      className="text-black hover:text-gray-600 transition-colors font-medium"
                    >
                      orders@rainbynurain.com
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -2 }}
                className="group"
              >
                <div className="flex items-start gap-6 p-8 border border-gray-200 transition-all duration-200 hover:border-black">
                  <div className="w-12 h-12 bg-black flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 uppercase tracking-wide text-sm">Press & Collaborations</h3>
                    <p className="text-gray-600 mb-3 text-sm">Media inquiries and partnership opportunities</p>
                    <a 
                      href="mailto:press@rainbynurain.com" 
                      className="text-black hover:text-gray-600 transition-colors font-medium"
                    >
                      press@rainbynurain.com
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              whileHover={{ y: -2 }}
              className="mt-12 p-8 bg-black text-white"
            >
              <h3 className="font-medium mb-4 uppercase tracking-wide text-sm">Response Times</h3>
              <p className="text-gray-300 leading-relaxed">
                We typically respond within 24-48 hours during business days. 
                For urgent order issues, please include your order number in the subject line.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Brand tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-24 pt-16 border-t border-gray-200"
        >
          <p className="text-gray-400 uppercase tracking-widest text-sm">
            Left Home to Feed Home
          </p>
        </motion.div>
      </div>
    </main>
  );
}