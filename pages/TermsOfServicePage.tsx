import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export function TermsOfServicePage() {
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
            <FileText className="w-6 h-6" />
            <h1 className="font-heading text-4xl">Terms of Service</h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl">
            These terms govern your use of the Rain by Nurain website and services. Please read them carefully.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 1, 2025</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="font-heading text-2xl mb-4">Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>By accessing and using the Rain by Nurain website, you accept and agree to be bound by the terms and provision of this agreement.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Use License</h2>
              <div className="space-y-4 text-gray-700">
                <p>Permission is granted to temporarily download one copy of the materials on Rain by Nurain's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Product Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>We strive to provide accurate product information, including:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Product descriptions and specifications</li>
                  <li>Pricing and availability</li>
                  <li>Images and colors (may vary due to monitor settings)</li>
                </ul>
                <p>We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Orders and Payment</h2>
              <div className="space-y-4 text-gray-700">
                <p>By placing an order, you agree to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Pay all charges incurred by you or your account</li>
                  <li>Accept our pricing, shipping, and return policies</li>
                </ul>
                <p>We reserve the right to refuse or cancel orders for any reason, including but not limited to product availability, errors in product information, or suspected fraud.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Shipping and Delivery</h2>
              <div className="space-y-4 text-gray-700">
                <p>Shipping terms include:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Delivery costs are communicated at dispatch</li>
                  <li>Risk of loss transfers upon delivery to carrier</li>
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>Additional duties and taxes may apply for international orders</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Returns and Refunds</h2>
              <div className="space-y-4 text-gray-700">
                <p>Our return policy allows for:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>30-day return window from delivery date</li>
                  <li>Items must be in original condition with tags</li>
                  <li>Return authorization required before shipping</li>
                  <li>Final sale items are not returnable</li>
                </ul>
                <p>Refunds will be processed to the original payment method within 5-7 business days of receiving the return.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Intellectual Property</h2>
              <div className="space-y-4 text-gray-700">
                <p>All content on this website, including but not limited to designs, text, graphics, logos, and images, is the property of Rain by Nurain and is protected by copyright and other intellectual property laws.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">User Accounts</h2>
              <div className="space-y-4 text-gray-700">
                <p>When creating an account, you agree to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide accurate and current information</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Prohibited Uses</h2>
              <div className="space-y-4 text-gray-700">
                <p>You may not use our website for:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>Violating any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>Infringing upon or violating our intellectual property rights or the intellectual property rights of others</li>
                  <li>Harassing, abusing, insulting, harming, defaming, slandering, disparaging, intimidating, or discriminating</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Limitation of Liability</h2>
              <div className="space-y-4 text-gray-700">
                <p>In no event shall Rain by Nurain or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Rain by Nurain's website.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Modifications</h2>
              <div className="space-y-4 text-gray-700">
                <p>Rain by Nurain may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl mb-4">Contact Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className="bg-gray-50 p-6 mt-4">
                  <p><strong>Rain by Nurain</strong></p>
                  <p>Email: legal@rainbynurain.com</p>
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