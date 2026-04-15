"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard"; 
import { motion, AnimatePresence } from "framer-motion";

// 1. Strict Type Definitions
interface ProductOption {
  id: string;
  label: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  price: number; 
  category: string;
  image_url?: string;
  description?: string;
  options?: ProductOption[];
}

export default function Storefront({ initialProducts }: { initialProducts: Product[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 2. Dynamic Category Extraction
  const categories = useMemo(() => {
    const uniqueCats = Array.from(
      new Set(initialProducts.map((p) => p.category).filter(Boolean))
    );
    return ["All", ...uniqueCats.sort()];
  }, [initialProducts]);

  // 3. Filter Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchQuery, selectedCategory]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
      
      {/* --- Control Panel --- */}
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-16">
        
        {/* Search Bar */}
        <div className="relative w-full lg:max-w-xl group flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-4.5 border border-gray-100 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm hover:border-gray-200 text-slate-900"
            placeholder="Search for digital tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills - Styled with a visible scrollbar */}
        <div className="flex gap-3 overflow-x-auto w-full custom-scrollbar pb-4 lg:pb-2 items-center scroll-smooth flex-nowrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-7 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] scale-105"
                  : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:border-gray-200 shadow-sm"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* --- Product Grid --- */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div 
              key="product-grid"
              layout
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.01, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full py-32 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-gray-50 shadow-sm"
            >
              <div className="bg-gray-50 p-8 rounded-full mb-6">
                <span className="text-6xl">🏜️</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No tools match your search</h3>
              <p className="text-gray-500 mb-8 text-center max-w-sm px-4 font-medium">
                Try adjusting your filters or search for something else.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black hover:shadow-xl transition-all active:scale-95"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}