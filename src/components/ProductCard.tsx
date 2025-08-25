import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Package, Shirt, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { toast } from 'sonner@2.0.3';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    isNew?: boolean;
    sizes?: string[];
    colors?: string[];
  };
  className?: string;
}

const categoryIcons = {
  hoodies: Package,
  tees: Shirt,
  outerwear: Zap,
  pants: Package,
  accessories: Star,
};

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const { formatPrice } = useCurrency();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Safety checks
  if (!product) {
    return null;
  }

  const isWishlisted = wishlist?.some(item => item.id === product.id) || false;
  const CategoryIcon = categoryIcons[product.category as keyof typeof categoryIcons] || Package;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Black',
      quantity: 1
    });
    toast.success('Added to cart!');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      className={`group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              setImageLoading(false);
              e.currentTarget.src = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop';
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-black text-white text-xs px-2 py-1 font-medium">
                NEW
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="sm"
              variant="secondary"
              className="w-9 h-9 p-0 bg-white/90 hover:bg-white border-0 shadow-md"
              onClick={handleWishlist}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
          </div>

          {/* Quick add to cart */}
          <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <Button
              size="sm"
              className="w-full bg-black/90 hover:bg-black text-white border-0 shadow-md font-medium tracking-wide"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="flex items-center gap-1 mb-2">
            <CategoryIcon className="w-3 h-3 text-gray-500" />
            <span className="text-product-category text-gray-500 uppercase">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-product-title text-gray-900 mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-product-price text-gray-900">
              {formatPrice(product.price)}
            </span>
            
            {/* Size indicator */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map((size) => (
                  <span key={size} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 font-mono">
                    {size}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs text-gray-400">+{product.sizes.length - 3}</span>
                )}
              </div>
            )}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 border border-gray-200"
                  style={{
                    backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                   color.toLowerCase() === 'black' ? '#000000' :
                                   color.toLowerCase() === 'grey' || color.toLowerCase() === 'gray' ? '#808080' :
                                   color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                   color.toLowerCase() === 'olive' ? '#6b7280' :
                                   '#d1d5db'
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-400 ml-1">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}