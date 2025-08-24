import React from "react";
import { ShoppingBag, Menu, Search, User, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "../contexts/AppContext";
import { useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const { cartCount, setIsCartOpen, setIsMobileMenuOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(true);
  };

  const navLinks = [
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Community", path: "/community" },
  ];

  // Check if current user is admin (in real app, this would come from auth context)
  const isAdmin = true; // For demo purposes

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-black/10 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden"
            onClick={handleMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`hover:text-gray-600 transition-colors ${
                  location.pathname === link.path ? "text-black font-medium" : ""
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <button
              onClick={() => navigate("/")}
              className="block text-center"
            >
              <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
                RBN
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">
                Rain by Nurain
              </p>
            </button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/account")}
            >
              <User className="h-5 w-5" />
            </Button>
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/admin")}
                className="text-purple-600 hover:text-purple-700"
                title="Admin Dashboard"
              >
                <Shield className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={handleCartClick}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}