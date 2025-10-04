import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Truck, Shield, RotateCcw, Star, Package, Shirt, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

const categoryIcons = {
  hoodies: Package,
  tees: Shirt,
  outerwear: Zap,
  pants: Package,
  accessories: Star,
};

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, setIsCartOpen, toggleWishlist, wishlist } = useApp();
  const { formatPrice } = useCurrency();
  
  const product = products.find(p => p.id === parseInt(id || '0'));
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl mb-4">Product Not Found</h1>
          <p className="font-body text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // Generate product images array
  const productImages = [
    product.image,
    ...(product.hoverImage ? [product.hoverImage] : []),
  ];

  const handleAddToCart = () => {
    // Check if product is out of stock
    if (!product.stock || product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize || (product.sizes?.[0] || 'M'),
      color: selectedColor || (product.colors?.[0] || 'Black'),
      quantity: quantity
    });
    
    toast.success('Added to cart!');
    setIsCartOpen(true);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    const isWishlisted = wishlist.some(item => item.id === product.id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const relatedProducts = products.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const CategoryIcon = categoryIcons[product.category as keyof typeof categoryIcons] || Package;
  const isWishlisted = wishlist.some(item => item.id === product.id);
  const isOutOfStock = !product.stock || product.stock === 0;
  const isLowStock = product.stock && product.stock <= 5 && product.stock > 0;

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm font-body text-gray-500 mb-8"
        >
          <button onClick={() => navigate('/')} className="hover:text-gray-700">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/shop')} className="hover:text-gray-700">Shop</button>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-4"
          >
            {/* Thumbnail Column */}
            {productImages.length > 1 && (
              <div className="flex flex-col gap-4 w-20">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-black shadow-md' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main Image */}
            <div className="flex-1 aspect-[4/5] overflow-hidden bg-gray-50">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CategoryIcon className="w-4 h-4 text-gray-500" />
                <span className="text-product-category text-gray-500 uppercase">
                  {product.category}
                </span>
                <Badge className="bg-black text-white text-xs px-2 py-1">New</Badge>
              </div>
              
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl mb-4">{product.name}</h1>
              <p className="text-2xl md:text-3xl font-semibold font-body mb-6">{formatPrice(product.price, 'NGN')}</p>
            </div>

            {/* Description */}
            <div>
              <p className="font-body text-lg text-gray-600 leading-relaxed">
                {product.description || "Premium streetwear piece crafted with attention to detail and quality. Designed for those who appreciate authentic style and comfort."}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block font-body font-semibold">Size</label>
                  <button 
                    onClick={() => navigate('/size-guide')}
                    className="text-sm text-gray-600 hover:text-black underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 border font-body font-medium text-center transition-all hover:border-gray-400 ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:bg-gray-50'
                      } ${size === 'One Size Fits All' ? 'col-span-3 text-sm' : ''}`}
                    >
                      {size === 'One Size Fits All' ? 'One Size' : size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block font-body font-semibold mb-4">Color</label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 border-2 rounded-full transition-all hover:scale-105 ${
                        selectedColor === color ? 'border-black shadow-lg ring-2 ring-black/20' : 'border-gray-200 hover:border-gray-300'
                      } ${color.toLowerCase() === 'white' ? 'border-gray-300' : ''}`}
                      style={{
                        backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                       color.toLowerCase() === 'black' ? '#000000' :
                                       color.toLowerCase() === 'grey' || color.toLowerCase() === 'gray' ? '#6b7280' :
                                       color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                       color.toLowerCase() === 'olive' ? '#65a30d' :
                                       color.toLowerCase() === 'khaki' ? '#a3a08a' :
                                       color.toLowerCase() === 'indigo' ? '#4338ca' :
                                       color.toLowerCase().includes('stone') ? '#94a3b8' :
                                       '#d1d5db'
                      }}
                      title={color}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="font-body text-sm text-gray-600 mt-2">Selected: {selectedColor}</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block font-body font-semibold mb-4">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-6 py-2 border-x font-body font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            {isOutOfStock && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-center">
                <span className="text-red-700 font-medium">Out of Stock</span>
              </div>
            )}
            {isLowStock && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded text-center">
                <span className="text-orange-700 font-medium">Only {product.stock} left in stock</span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                size="sm" 
                className="w-full text-sm font-normal tracking-wide"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {isOutOfStock ? 'Out of Stock' : `Add to Cart - ${formatPrice(product.price * quantity, 'NGN')}`}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-sm font-normal"
                onClick={handleWishlist}
              >
                <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Features */}
            <div className="border-t pt-8 space-y-4">
              <div className="flex items-center gap-4 font-body text-gray-700">
                <Truck className="w-5 h-5 text-gray-500" />
                <span>Delivery charges communicated at dispatch</span>
              </div>
              <div className="flex items-center gap-4 font-body text-gray-700">
                <RotateCcw className="w-5 h-5 text-gray-500" />
                <span>30-day returns & exchanges</span>
              </div>
              <div className="flex items-center gap-4 font-body text-gray-700">
                <Shield className="w-5 h-5 text-gray-500" />
                <span>Authentic & quality guaranteed</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-20"
        >
          <div className="bg-black text-white py-16 px-8 text-center">
            <h3 className="font-heading text-2xl md:text-3xl mb-4">
              Left Home to Feed Home
            </h3>
            <p className="font-body text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Every piece tells a story. Every purchase supports the journey. Join the RBN community and be part of something bigger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-black"
                onClick={() => navigate('/shop')}
              >
                Shop Collection
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-black"
                onClick={() => navigate('/community')}
              >
                Join Community
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}