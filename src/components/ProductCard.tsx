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
    e.stopPropagation();

    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    const defaultSize = product.sizes[0] || "M";
    const defaultColor = product.colors[0] || "Black";

    addToCart(product, defaultSize, defaultColor, 1);
    toast.success("Added to cart!");
    setIsCartOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Added to wishlist!");
  };

  return (
    <div
      className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
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
          size="icon"
          className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleWishlist}
        >
          <Heart className="h-4 w-4 text-gray-700" />
        </Button>

        {/* New badge */}
        {isNew && (
          <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-[10px] font-semibold rounded-full shadow-sm">
            NEW
          </div>
        )}

        {/* Quick add to cart */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            className="w-full bg-white text-black font-medium rounded-xl shadow hover:bg-gray-100"
            onClick={handleQuickAdd}
          >
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      <div className="px-2 pt-3 pb-4 space-y-1">
        {category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {category}
          </p>
        )}
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug line-clamp-2">
          {name}
        </h3>
        <p className="text-lg font-bold text-gray-800">{formatPrice(price)}</p>
      </div>
    </div>
  );
}
