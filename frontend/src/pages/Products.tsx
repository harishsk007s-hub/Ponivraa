import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RefreshCw, Sprout } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { api } from '../api';
import { ProductCard } from '../components/ProductCard';

// Strictly Mango, Honey, Guava (Apple and Orange removed)
const CATEGORIES: Array<'All' | ProductCategory> = ['All', 'Mango', 'Honey', 'Guava'];

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as ProductCategory | 'All') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>(
    CATEGORIES.includes(initialCategory) ? initialCategory : 'All'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const cat = searchParams.get('category') as ProductCategory | 'All';
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts(
        selectedCategory === 'All' ? undefined : selectedCategory,
        searchQuery ? searchQuery : undefined
      );
      setProducts(data);
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message || 'Unable to load products. Please check back shortly.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (cat: 'All' | ProductCategory) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-lightgreen text-primary text-xs font-bold px-3 py-1 rounded-full border border-lightgreen-border uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5 text-accent" />
            <span>Farm-Fresh Harvest Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-darktext">
            Straight from the Soil of Alagarkovil
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            Select from naturally tree-ripened mangoes, pure raw hill honey varieties, and crisp native guavas.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#C8E6C9] shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Buttons: ONLY All, Mango, Honey, Guava */}
            <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-md ring-2 ring-primary/30'
                      : 'bg-[#F4FAF5] text-[#2D5A32] hover:bg-[#E8F5E9] hover:text-[#1B4332] border border-[#C8E6C9]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search mangoes, honey, guava..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#C8E6C9] bg-[#F4FAF5] text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-darktext"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Summary */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-6 px-1">
          <span>
            Showing <strong className="text-darktext">{products.length}</strong> items
            {selectedCategory !== 'All' && (
              <span> in category <strong className="text-primary">{selectedCategory}</strong></span>
            )}
            {searchQuery && (
              <span> matching "<strong className="text-darktext">{searchQuery}</strong>"</span>
            )}
          </span>
          <button
            onClick={loadProducts}
            className="flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
            title="Refresh product list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Product Grid / States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 shadow-sm"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-rose-200 p-8 max-w-lg mx-auto">
            <p className="text-sm text-rose-700 font-bold mb-3">{error}</p>
            <button
              onClick={loadProducts}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl"
            >
              Try Again
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 p-8 max-w-md mx-auto space-y-3">
            <Sprout className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-darktext">No products in this category right now</h3>
            <p className="text-xs text-gray-500">
              Try searching with a different term or select "All" to view today’s full harvest.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary-hover transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
