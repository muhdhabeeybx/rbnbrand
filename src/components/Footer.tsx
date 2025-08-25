import React from "react";
import { Instagram, Twitter, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();

  const shopLinks = [
    { name: "New Arrivals", path: "/shop" },
    { name: "Hoodies", path: "/shop/hoodies" },
    { name: "T-Shirts", path: "/shop/tees" },
    { name: "Outerwear", path: "/shop/outerwear" },
    { name: "Accessories", path: "/shop/accessories" },
  ];

  const companyLinks = [
    { name: "About", path: "/about" },
    { name: "Story", path: "/about" },
    { name: "Community", path: "/community" },
    { name: "Contact", path: "/contact" },
    { name: "Careers", path: "/contact" },
  ];

  return (
    <footer className="bg-white border-t border-black/10 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <button
              onClick={() => navigate('/')}
              className="text-left"
            >
              <h3 className="text-xl font-bold mb-2">RBN</h3>
              <p className="text-sm text-gray-600 mb-4">Rain by Nurain</p>
            </button>
            <p className="text-xs text-gray-500 leading-relaxed">
              Left Home to Feed Home.<br />
              Streetwear with soul for the culture.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {shopLinks.map((link, index) => (
                <li key={`shop-${index}-${link.name}`}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="hover:text-black transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {companyLinks.map((link, index) => (
                <li key={`company-${index}-${link.name}`}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="hover:text-black transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><button className="hover:text-black transition-colors text-left">Size Guide</button></li>
              <li><button className="hover:text-black transition-colors text-left">Shipping</button></li>
              <li><button className="hover:text-black transition-colors text-left">Returns</button></li>
              <li><button className="hover:text-black transition-colors text-left">Care Instructions</button></li>
              <li><button className="hover:text-black transition-colors text-left">FAQ</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              <Music className="h-5 w-5" />
            </a>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-gray-500">
            <span>© 2024 Rain by Nurain. All rights reserved.</span>
            <div className="flex space-x-4">
              <button className="hover:text-black transition-colors">Privacy Policy</button>
              <button className="hover:text-black transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}