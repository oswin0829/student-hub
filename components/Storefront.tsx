"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard"; 
import { motion, AnimatePresence } from "framer-motion"; // 1. The Animation Engine

const CATEGORIES = ["All", "AI Tools", "Educational", "Writing Tools", "Templates"];

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
};

export default function Storefront({ initialProducts }: { initialProducts: Product[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchQuery, selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. Control Panel (Search & Pills) */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
        
        {/* Search Bar with focus glow */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
            <span className="text-gray-400 text-lg">🔍</span>
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            placeholder="Search for digital tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] scale-105"
                  : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Animated Product Grid */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout // This makes cards slide smoothly when others are removed
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.04, // The "Stagger" effect
                    ease: [0.23, 1, 0.32, 1] // Custom cubic-bezier for a snappier feel
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // 3. Animated Empty State
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-inner"
            >
              <span className="text-6xl mb-6">🏜️</span>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Nothing found</h3>
              <p className="text-gray-500 mb-8 text-center max-w-sm px-4">
                We couldn&apos;t find any tools matching &quot;<span className="font-bold text-gray-900">{searchQuery}</span>&quot;.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
              >
                Reset Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}