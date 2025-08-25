import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, SortDesc, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { useLocation } from 'react-router-dom';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'hoodies', name: 'Hoodies' },
  { id: 'tees', name: 'T-Shirts' },
  { id: 'outerwear', name: 'Outerwear' },
  { id: 'pants', name: 'Pants' },
];

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'newest', name: 'Newest' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'name', name: 'Name: A-Z' },
];

export function ShopPage() {
  const { products } = useApp();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get search query from URL if present
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  // Extend products to have 16 items by repeating the existing ones
  const extendedProducts = useMemo(() => {
    // Safety check
    if (!products || !Array.isArray(products) || products.length === 0) {
      return [];
    }

    const baseProducts = products.slice(0, 8); // Use first 8 products
    const extended = [];
    
    // Create 16 products by duplicating and modifying
    for (let i = 0; i < 16; i++) {
      const baseProduct = baseProducts[i % baseProducts.length];
      extended.push({
        ...baseProduct,
        id: baseProduct.id + (Math.floor(i / baseProducts.length) * 1000), // Unique IDs
        name: i >= 8 ? `${baseProduct.name} - Premium` : baseProduct.name, // Variation for second set
        price: i >= 8 ? baseProduct.price * 1.2 : baseProduct.price, // Slightly higher price for premium
      });
    }
    
    return extended;
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = extendedProducts;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].reverse();
        break;
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [extendedProducts, selectedCategory, sortBy, searchQuery]);

  // Show loading state if products are not available
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6">
              Shop Collection
            </h1>
            <p className="font-body text-lg text-gray-600">
              Loading products...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6">
            Shop Collection
          </h1>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our complete range of premium streetwear. Each piece is crafted with purpose and designed to make a statement.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="bg-gray-50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left side - Categories and Search */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="font-medium"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Right side - Sort and View */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SortDesc className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3 ml-1"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results count and active filters */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="font-body text-sm text-gray-600">
                {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
              </span>
              
              {/* Active filters */}
              <div className="flex gap-2">
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:bg-gray-300 rounded">
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="ml-1 hover:bg-gray-300 rounded">
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 lg:grid-cols-2'
            }`}
          >
            {filteredAndSortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProductCard 
                  product={product} 
                  className={viewMode === 'list' ? 'flex gap-6' : ''}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-heading text-2xl mb-2">No products found</h3>
            <p className="font-body text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              variant="outline"
            >
              Clear all filters
            </Button>
          </motion.div>
        )}

        {/* Load More (for future implementation) */}
        {filteredAndSortedProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-12">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}