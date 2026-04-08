"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl overflow-hidden flex flex-col group h-full transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl md:hover:shadow-2xl">
      
      {/* 1. Responsive Image Area: Less padding on mobile (p-3) */}
      <Link 
        href={`/product/${product.id}`} 
        className="relative w-full aspect-square bg-white flex items-center justify-center cursor-pointer overflow-hidden p-3 md:p-6"
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
             <span className="text-xl md:text-3xl opacity-20">📦</span>
             <span className="text-gray-400 font-medium italic text-[10px] uppercase tracking-tighter">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>
      
      {/* 2. Responsive Content Padding: p-3 on mobile, p-6 on desktop */}
      <div className="p-3 md:p-6 flex flex-col flex-grow">
        
        {/* Category Badge: Smaller text on mobile */}
        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-blue-600 mb-1 md:mb-2 bg-blue-50 w-fit px-1.5 md:px-2 py-0.5 rounded">
          {product.category || "Tool"}
        </p>

        {/* Title: Scaled text (sm -> lg) and tighter line height */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 cursor-pointer group-hover:text-blue-600 transition-colors leading-tight" title={product.name}>
            {product.name}
          </h3>
        </Link>
        
        {/* Price & Action: More compact for mobile */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-0.5 md:gap-1 mb-3 md:mb-4">
            <span className="text-[10px] md:text-xs font-bold text-gray-500">RM</span>
            <span className="text-lg md:text-2xl font-black text-gray-900">
              {product.price.toFixed(2)}
            </span>
          </div>
          
          <button 
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white py-2 md:py-3.5 rounded-lg md:rounded-xl text-xs md:text-base font-extrabold hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-1.5 md:gap-2 shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={14} className="md:w-[18px] md:h-[18px]" strokeWidth={3} />
            <span className="hidden xs:inline">Add to Cart</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}