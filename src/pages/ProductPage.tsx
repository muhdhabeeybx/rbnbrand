import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen, currency } = useApp();
  
  const product = PRODUCTS.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `${currency.symbol}${(price * currency.rate).toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success('Added to cart!');
    setIsCartOpen(true);
  };

  const relatedProducts = PRODUCTS.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index ? 'border-black' : 'border-transparent'
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Badge className="mb-2">New</Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
            </div>

            <div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block font-medium mb-3">Size</label>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block font-medium mb-3">Color</label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 transition-colors ${
                      selectedColor === color ? 'border-black' : 'border-gray-200'
                    } ${
                      color === 'Black' ? 'bg-black' :
                      color === 'White' ? 'bg-white' :
                      color === 'Grey' ? 'bg-gray-400' :
                      color === 'Olive' ? 'bg-green-700' :
                      color === 'Khaki' ? 'bg-yellow-600' :
                      color === 'Navy' ? 'bg-blue-900' :
                      color === 'Indigo' ? 'bg-indigo-600' :
                      color === 'Stone Wash' ? 'bg-blue-200' :
                      'bg-gray-300'
                    }`}
                    title={color}
                  />
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-gray-600 mt-2">Selected: {selectedColor}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-r-none"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-l-none"
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
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart - {formatPrice(product.price * quantity)}
              </Button>
              
              <Button variant="outline" size="lg" className="w-full">
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5" />
                <span>30-day returns</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <span>1-year warranty</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="sizing">Sizing</TabsTrigger>
              <TabsTrigger value="care">Care</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <div className="prose max-w-none">
                <h3>Product Details</h3>
                <p>{product.description}</p>
                <ul>
                  <li>Premium materials and construction</li>
                  <li>Designed for comfort and durability</li>
                  <li>Versatile styling for any occasion</li>
                  <li>Ethically sourced and manufactured</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="sizing" className="mt-6">
              <div className="prose max-w-none">
                <h3>Size Guide</h3>
                <p>Our pieces are designed with a modern fit. For the best fit, we recommend:</p>
                <ul>
                  <li>Measure yourself in undergarments</li>
                  <li>Compare measurements to our size chart</li>
                  <li>When in doubt, size up for a more relaxed fit</li>
                  <li>Contact us if you need personalized sizing advice</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="care" className="mt-6">
              <div className="prose max-w-none">
                <h3>Care Instructions</h3>
                <ul>
                  <li>Machine wash cold with like colors</li>
                  <li>Use gentle cycle for best results</li>
                  <li>Tumble dry low or hang to dry</li>
                  <li>Iron on low heat if needed</li>
                  <li>Do not bleach or dry clean</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium">{relatedProduct.name}</h3>
                    <p className="font-bold">{formatPrice(relatedProduct.price)}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}