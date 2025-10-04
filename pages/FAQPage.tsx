import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export function FAQPage() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          q: "How long does shipping take?",
          a: "Shipping times vary by location. Domestic orders typically take 1-7 business days, while international orders can take 7-28 business days. Shipping costs are communicated at dispatch."
        },
        {
          q: "Do you offer international shipping?",
          a: "Yes, we ship worldwide. International customers are responsible for customs duties and taxes."
        },
        {
          q: "Can I track my order?",
          a: "Absolutely! Once your order is dispatched, you'll receive a tracking number via email and SMS."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer 30-day returns for items in original condition with tags attached. Final sale items cannot be returned."
        },
        {
          q: "How do I return an item?",
          a: "Contact our customer service team for a return authorization number, then ship the item back to our returns address."
        },
        {
          q: "Do you offer exchanges?",
          a: "Yes, we offer free exchanges for size and color within 30 days of delivery."
        }
      ]
    },
    {
      category: "Sizing & Fit",
      questions: [
        {
          q: "How do I know what size to order?",
          a: "Check our detailed size guide with measurements for length, width, and sleeve. Remember, all our tees are slightly oversized."
        },
        {
          q: "What does 'one size fits all' mean?",
          a: "Our one-size items are designed to fit sizes S-L comfortably with a relaxed, oversized fit."
        },
        {
          q: "Are your clothes true to size?",
          a: "Our pieces are designed with a slightly oversized fit for that authentic streetwear look."
        }
      ]
    },
    {
      category: "Product Care",
      questions: [
        {
          q: "How should I wash my RBN pieces?",
          a: "Machine wash cold, inside out, with similar colors. Avoid bleach and fabric softeners. Air dry when possible."
        },
        {
          q: "Can I iron the graphics?",
          a: "Never iron directly on prints. Always iron inside out or use a pressing cloth to protect the design."
        }
      ]
    },
    {
      category: "Account & Payment",
      questions: [
        {
          q: "Do I need an account to place an order?",
          a: "You can checkout as a guest, but creating an account allows you to track orders and access your purchase history."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept major credit cards, debit cards, and mobile payment methods through our secure payment processor."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 p-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6" />
            <h1 className="font-heading text-4xl">Frequently Asked Questions</h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl">
            Find answers to common questions about RBN. Can't find what you're looking for? Contact our support team.
          </p>
        </motion.div>

        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h2 className="font-heading text-2xl mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const itemIndex = categoryIndex * 100 + questionIndex;
                  const isOpen = openItems.includes(itemIndex);
                  
                  return (
                    <div key={questionIndex} className="border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => toggleItem(itemIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-gray-700 border-t border-gray-100">
                          <p className="pt-4">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="font-heading text-xl mb-4">Still Need Help?</h3>
          <p className="text-gray-600 mb-6">
            Our customer service team is ready to assist you with any questions.
          </p>
          <Button onClick={() => navigate('/contact')}>Contact Support</Button>
        </motion.div>
      </div>
    </div>
  );
}