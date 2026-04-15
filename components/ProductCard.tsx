"use client";

import { useState } from 'react'; 
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

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
  options?: ProductOption[];
}

export default function ProductCard({ product }: { product: Product }) {
  // Default to null so the range displays initially
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);

  const addToCart = useCartStore((state) => state.addToCart);

  // Calculate the price range for display
  const allPrices = product.options && product.options.length > 0 
    ? [product.price, ...product.options.map(opt => opt.price)]
    : [product.price];
    
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const isRange = minPrice !== maxPrice;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the Link from triggering
    
    const hasOptions = product.options && product.options.length > 0;
    
    // UX Validation: If it has options, one MUST be selected
    if (hasOptions && !selectedOption) {
      toast.error(`Please select a plan for ${product.name}`, {
        duration: 3000,
        icon: '⚠️'
      });
      return;
    }
    
    const itemToAdd = {
      ...product,
      price: selectedOption ? selectedOption.price : product.price,
      variantLabel: selectedOption ? selectedOption.label : "Standard",
      // Unique ID for the cart: combines product ID and option ID
      cartId: selectedOption ? `${product.id}-${selectedOption.id}` : `${product.id}`
    };

    addToCart(itemToAdd);
    toast.success(`Added to cart: ${product.name} ${selectedOption ? `(${selectedOption.label})` : ''}`);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl overflow-hidden flex flex-col group h-full transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
      
      {/* Image Area */}
      <Link 
        href={`/product/${product.id}`} 
        className="relative w-full aspect-square bg-white flex items-center justify-center cursor-pointer overflow-hidden p-2 md:p-4"
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
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
      
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        
        {/* Category Badge */}
        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600/80 mb-2">
          {product.category || "General"}
        </p>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm md:text-base font-semibold text-slate-800 mb-2 line-clamp-2 cursor-pointer group-hover:text-blue-600 transition-colors leading-snug tracking-tight">
            {product.name}
          </h3>
        </Link>

        {/* Variant Selection Pills - FIXED: Unique Keys */}
        {product.options && product.options.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 mt-1">
            {product.options.map((option, index) => (
              <button
                key={`${option.id}-${index}`} // Combined ID and index to ensure uniqueness
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedOption(option);
                }}
                className={`text-[9px] font-bold px-2 py-1 rounded-md border transition-all ${
                  selectedOption?.id === option.id
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white border-gray-100 text-slate-500 hover:border-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex flex-col mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] md:text-xs font-bold text-slate-400 font-mono">RM</span>
              
              {selectedOption ? (
                 <span className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter">
                   {selectedOption.price.toFixed(2)}
                 </span>
              ) : isRange ? (
                 <span className="text-sm md:text-lg font-black text-slate-900 tracking-tighter">
                   {minPrice.toFixed(2)} — {maxPrice.toFixed(2)}
                 </span>
              ) : (
                 <span className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter">
                   {product.price.toFixed(2)}
                 </span>
              )}
            </div>
            
            {!selectedOption && isRange && (
              <span className="text-[8px] uppercase font-bold text-blue-500/60 tracking-widest mt-0.5">
                Multiple Options Available
              </span>
            )}
          </div>
          
          <button 
            type="button"
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingCart size={16} strokeWidth={2.5} />
            <span className="xs:inline">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}