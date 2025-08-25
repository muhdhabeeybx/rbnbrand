import React, { useState } from 'react';
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

  // Generate multiple images for the product (since our products only have one image)
  const productImages = [
    product.image,
    product.image, // Duplicate for demo
    product.image, // Duplicate for demo
  ];

  const handleAddToCart = () => {
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
            className="space-y-4"
          >
            <div className="aspect-[4/5] overflow-hidden bg-gray-50">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-black' : 'border-gray-200 hover:border-gray-300'
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
              <p className="text-2xl md:text-3xl font-semibold font-body mb-6">{formatPrice(product.price)}</p>
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
                <label className="block font-body font-semibold mb-4">Size</label>
                <div className="grid grid-cols-6 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 border font-body font-medium text-center transition-all hover:border-gray-400 ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {size}
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
                      className={`w-12 h-12 border-2 transition-all hover:scale-105 ${
                        selectedColor === color ? 'border-black shadow-md' : 'border-gray-200'
                      }`}
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

            {/* Actions */}
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full text-base font-medium tracking-wide"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                Add to Cart - {formatPrice(product.price * quantity)}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full text-base font-medium"
                onClick={handleWishlist}
              >
                <Heart className={`w-5 h-5 mr-3 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Features */}
            <div className="border-t pt-8 space-y-4">
              <div className="flex items-center gap-4 font-body text-gray-700">
                <Truck className="w-5 h-5 text-gray-500" />
                <span>Free shipping on orders over $100</span>
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

        {/* Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-20"
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="details" className="font-body">Details</TabsTrigger>
              <TabsTrigger value="sizing" className="font-body">Sizing</TabsTrigger>
              <TabsTrigger value="care" className="font-body">Care</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-8">
              <div className="max-w-3xl">
                <h3 className="font-heading text-2xl mb-4">Product Details</h3>
                <div className="font-body text-gray-600 space-y-4">
                  <p className="leading-relaxed">
                    {product.description || "This premium piece represents the intersection of streetwear culture and high-quality craftsmanship. Designed for those who understand that true style comes from authenticity, not trends."}
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li>• Premium materials sourced ethically</li>
                    <li>• Designed for comfort and durability</li>
                    <li>• Versatile styling for any occasion</li>
                    <li>• Part of our sustainable fashion initiative</li>
                    <li>• Limited edition - when it's gone, it's gone</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sizing" className="mt-8">
              <div className="max-w-3xl">
                <h3 className="font-heading text-2xl mb-4">Size Guide</h3>
                <div className="font-body text-gray-600 space-y-4">
                  <p className="leading-relaxed">
                    Our pieces are designed with a modern, comfortable fit. For the best experience:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li>• Take measurements while wearing minimal clothing</li>
                    <li>• Compare your measurements to our detailed size chart</li>
                    <li>• When in doubt, size up for a more relaxed fit</li>
                    <li>• Each product page includes specific fit notes</li>
                    <li>• Contact our team for personalized sizing advice</li>
                  </ul>
                  <div className="mt-6 p-4 bg-gray-50">
                    <p className="font-medium text-gray-900 mb-2">Need help with sizing?</p>
                    <p className="text-sm">Our customer service team is available to help you find the perfect fit. Contact us anytime.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="care" className="mt-8">
              <div className="max-w-3xl">
                <h3 className="font-heading text-2xl mb-4">Care Instructions</h3>
                <div className="font-body text-gray-600 space-y-4">
                  <p className="leading-relaxed">
                    To keep your RBN pieces looking their best, follow these care guidelines:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li>• Machine wash cold with similar colors</li>
                    <li>• Use gentle cycle and mild detergent</li>
                    <li>• Tumble dry low or air dry for best results</li>
                    <li>• Iron on low heat if needed, avoid direct contact with prints</li>
                    <li>• Do not bleach, dry clean, or use fabric softener</li>
                    <li>• Store on hangers to maintain shape</li>
                  </ul>
                  <div className="mt-6 p-4 bg-gray-50">
                    <p className="font-medium text-gray-900 mb-2">Pro Tip</p>
                    <p className="text-sm">Turn garments inside out before washing to preserve colors and prints. Your pieces will thank you.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl mb-4">You Might Also Like</h2>
              <p className="font-body text-lg text-gray-600">
                More pieces from the {product.category} collection
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}