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
    <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl overflow-hidden flex flex-col group h-full transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
      
      {/* 1. Image Area: Square container with minimal padding to maximize image size */}
      <Link 
        href={`/product/${product.id}`} 
        className="relative w-full aspect-square bg-white flex items-center justify-center cursor-pointer overflow-hidden p-2 md:p-4"
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            /* Still using object-contain to ensure text/logos aren't cropped, 
               but max-w/h-full ensures it fills the square as much as possible. */
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
             <span className="text-xl md:text-3xl opacity-20">📦</span>
             <span className="text-gray-400 font-medium italic text-[10px] uppercase tracking-widest">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/5 transition-colors duration-300" />
      </Link>
      
      {/* 2. Content Area: Reverting to tight, clean spacing */}
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        
        {/* Category Badge */}
        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600/80 mb-2">
          {product.category || "General"}
        </p>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm md:text-base font-semibold text-slate-800 mb-3 line-clamp-2 cursor-pointer group-hover:text-blue-600 transition-colors leading-snug tracking-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Price & Action */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-[10px] md:text-xs font-bold text-slate-400">RM</span>
            <span className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter">
              {product.price.toFixed(2)}
            </span>
          </div>
          
          <button 
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} strokeWidth={2.5} />
            <span className="hidden xs:inline">Add to Cart</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}