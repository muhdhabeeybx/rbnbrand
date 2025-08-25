import React, { useState } from "react";
import { ShoppingBag, Menu, Search, User, Shield, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useApp } from "../contexts/AppContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from 'figma:asset/0579ff569064c8c2a3a6be5eccb9e10f44dae83d.png';

export function Navigation() {
  const { cartCount, setIsCartOpen, setIsMobileMenuOpen, products } = useApp();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
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
        <div className="flex items-center justify-between h-20">
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
                className={`font-body text-sm font-medium hover:text-gray-600 transition-colors ${
                  location.pathname === link.path ? "text-black" : "text-gray-700"
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
              <img src={logoImage} alt="RBN Logo" className="h-12 w-auto mx-auto" />
            </button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Currency Selector */}
            <Select value={currency} onValueChange={(value: 'USD' | 'NGN') => setCurrency(value)}>
              <SelectTrigger className="w-20 h-9 border-0 bg-transparent">
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="NGN">NGN</SelectItem>
              </SelectContent>
            </Select>

            {/* Search */}
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto">
                <SheetHeader>
                  <SheetTitle className="font-heading text-2xl text-left">Search Products</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <form onSubmit={handleSearchSubmit}>
                    <Input
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="text-lg h-14"
                      autoFocus
                    />
                  </form>
                  
                  {searchResults.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600 font-medium">Quick Results:</p>
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            setIsSearchOpen(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left"
                        >
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover" />
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-600 capitalize">{product.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

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
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center font-medium">
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