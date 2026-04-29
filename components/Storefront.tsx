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
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-black dark:group-focus-within:text-white">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-4.5 border border-black/5 dark:border-white/10 rounded-2xl leading-5 bg-white/50 dark:bg-black/50 backdrop-blur-md placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-black/20 dark:focus:border-white/20 transition-all shadow-inner hover:border-black/10 dark:hover:border-white/20 text-black dark:text-white"
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
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105"
                  : "bg-white/50 dark:bg-black/50 backdrop-blur-md text-slate-500 dark:text-slate-400 border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 hover:shadow-sm"
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
              className="w-full py-32 flex flex-col items-center justify-center bg-white dark:bg-black rounded-[2rem] border border-gray-50 dark:border-gray-800 shadow-sm"
            >
              <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-full mb-6">
                <span className="text-6xl">🏜️</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No tools match your search</h3>
              <p className="text-gray-500 mb-8 text-center max-w-sm px-4 font-medium">
                Try adjusting your filters or search for something else.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="px-10 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-black rounded-2xl font-bold hover:bg-black dark:hover:bg-white hover:shadow-xl transition-all active:scale-95"
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