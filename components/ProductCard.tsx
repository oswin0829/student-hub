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
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col group h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-100">
      
      {/* Clickable Image Area */}
      <Link 
        href={`/product/${product.id}`} 
        className="relative w-full h-52 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
             <span className="text-3xl opacity-20">📦</span>
             <span className="text-gray-400 font-medium italic text-xs uppercase tracking-tighter">No Image</span>
          </div>
        )}
        
        {/* Subtle Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Category Badge */}
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2 bg-blue-50 w-fit px-2 py-0.5 rounded">
          {product.category || "MegaHelper Tool"}
        </p>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 cursor-pointer group-hover:text-blue-600 transition-colors leading-tight" title={product.name}>
            {product.name}
          </h3>
        </Link>
        
        {/* Price & Action Section */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-xs font-bold text-gray-500">RM</span>
            <span className="text-2xl font-black text-gray-900">
              {product.price.toFixed(2)}
            </span>
          </div>
          
          <button 
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-extrabold hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
          >
            <ShoppingCart size={18} strokeWidth={3} />
            Add to Cart
          </button>
        </div>
      </div>

    </div>
  );
}