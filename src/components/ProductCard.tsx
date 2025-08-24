import React from "react";
import { Heart, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { PRODUCTS } from "../data/products";
import { toast } from "sonner@2.0.3";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
}

export function ProductCard({ id, name, price, image, category, isNew }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen, currency } = useApp();

  const formatPrice = (price: number) => {
    return `${currency.symbol}${(price * currency.rate).toFixed(2)}`;
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking quick add
    
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Add with default size and color if available
    const defaultSize = product.sizes[0] || "M";
    const defaultColor = product.colors[0] || "Black";
    
    addToCart(product, defaultSize, defaultColor, 1);
    toast.success("Added to cart!");
    setIsCartOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    toast.success("Added to wishlist!");
  };

  return (
    <div className="group cursor-pointer" onClick={handleCardClick}>
      <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleWishlist}
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* New badge */}
        {isNew && (
          <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium">
            NEW
          </div>
        )}

        {/* Quick add to cart */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            className="w-full bg-white text-black hover:bg-gray-100"
            onClick={handleQuickAdd}
          >
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {category && (
          <p className="text-xs text-gray-600 uppercase tracking-wide">{category}</p>
        )}
        <h3 className="font-medium">{name}</h3>
        <p className="text-lg font-medium">{formatPrice(price)}</p>
      </div>
    </div>
  );
}