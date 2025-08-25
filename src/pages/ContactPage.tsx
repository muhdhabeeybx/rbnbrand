import React, { useState } from 'react';
import { Mail, MessageSquare, Package, ArrowRight } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl mb-6 tracking-tight">CONTACT</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? Need support? Want to collaborate? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl mb-8">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block mb-2">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-black transition-colors"
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
                <label htmlFor="message" className="block mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-black transition-colors resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-black text-white p-4 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                Send Message
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-3xl mb-8">Other Ways to Reach Us</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                <Mail className="w-6 h-6 mt-1" />
                <div>
                  <h3 className="mb-1">Email Support</h3>
                  <p className="text-gray-600 text-sm mb-2">For general inquiries and support</p>
                  <a href="mailto:support@rainbynurain.com" className="underline">
                    support@rainbynurain.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                <Package className="w-6 h-6 mt-1" />
                <div>
                  <h3 className="mb-1">Order Support</h3>
                  <p className="text-gray-600 text-sm mb-2">Questions about your order or shipping</p>
                  <a href="mailto:orders@rainbynurain.com" className="underline">
                    orders@rainbynurain.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                <MessageSquare className="w-6 h-6 mt-1" />
                <div>
                  <h3 className="mb-1">Press & Collaborations</h3>
                  <p className="text-gray-600 text-sm mb-2">Media inquiries and partnership opportunities</p>
                  <a href="mailto:press@rainbynurain.com" className="underline">
                    press@rainbynurain.com
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-black text-white rounded-xl">
              <h3 className="mb-2">Response Times</h3>
              <p className="text-gray-300 text-sm">
                We typically respond within 24-48 hours during business days. 
                For urgent order issues, please include your order number in the subject line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}