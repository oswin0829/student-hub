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
}

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
      
      {/* Clickable Image Area */}
      <Link 
        href={`/product/${product.id}`} 
        className="w-full h-48 bg-gray-100 flex items-center justify-center cursor-pointer group-hover:bg-gray-200 transition-colors"
      >
        <span className="text-gray-400 font-medium italic text-sm">Product Image</span>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        {/* Category Badge */}
        <p className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">
          {product.category}
        </p>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors" title={product.name}>
            {product.name}
          </h3>
        </Link>
        
        {/* Bottom Section: Price & Action */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col gap-3">
            {/* Price */}
            <span className="text-2xl font-bold text-gray-900">
              RM{product.price.toFixed(2)}
            </span>
            
            {/* Full-width Button */}
            <button 
              onClick={handleAdd}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}