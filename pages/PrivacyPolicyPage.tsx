import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export function PrivacyPolicyPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 p-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6" />
            <h1 className="font-heading text-4xl">Privacy Policy</h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl">
            Your privacy is important to us. This policy explains how Rain by Nurain collects, uses, and protects your information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 1, 2025</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="font-heading text-2xl mb-4">Information We Collect</h2>
              <div className="space-y-4 text-gray-700">
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Create an account or make a purchase</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact our customer service</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p>This may include your name, email address, phone number, shipping address, payment information, and preferences.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our products and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Information Sharing</h2>
              <div className="space-y-4 text-gray-700">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Service providers who help us operate our business</li>
                  <li>Payment processors to handle transactions</li>
                  <li>Shipping companies to deliver your orders</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Data Security</h2>
              <div className="space-y-4 text-gray-700">
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Secure payment processing</li>
                  <li>Regular security assessments</li>
                  <li>Limited access to personal information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Your Rights</h2>
              <div className="space-y-4 text-gray-700">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
                <p>To exercise these rights, please contact us using the information provided below.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Cookies and Tracking</h2>
              <div className="space-y-4 text-gray-700">
                <p>Our website uses cookies and similar technologies to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Remember your preferences and login information</li>
                  <li>Analyze website traffic and usage</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Improve website functionality</li>
                </ul>
                <p>You can control cookies through your browser settings.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Children's Privacy</h2>
              <div className="space-y-4 text-gray-700">
                <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Changes to This Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have any questions about this privacy policy or our data practices, please contact us:</p>
                <div className="bg-gray-50 p-6 mt-4">
                  <p><strong>Rain by Nurain</strong></p>
                  <p>Email: privacy@rainbynurain.com</p>
                  <p>Phone: [Contact Number]</p>
                  <p>Address: [Business Address]</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center mt-12">
          <Button onClick={() => navigate('/contact')}>Contact Us</Button>
        </motion.div>
      </div>
    </div>
  );
}