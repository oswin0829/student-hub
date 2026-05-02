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
  description?: string;
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
      cartId: selectedOption ? `${product.id}-${selectedOption.id}` : `${product.id}`,
      quantity: 1
    };

    addToCart(itemToAdd);
    toast.success(`Added to cart: ${product.name} ${selectedOption ? `(${selectedOption.label})` : ''}`);
  };

  return (
    <div className="bg-white dark:bg-[#111113]/80 border border-black/5 dark:border-white/10 rounded-[2rem] shadow-sm hover:shadow-premium dark:shadow-premium-dark overflow-hidden flex flex-col group h-full transition-all duration-500 hover:-translate-y-1 hover:border-black/10 dark:hover:border-white/20">

      {/* Image Area */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-full aspect-[4/3] bg-slate-50 dark:bg-white/[0.02] flex items-center justify-center cursor-pointer overflow-hidden p-3 sm:p-8"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-xl"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl md:text-5xl opacity-20 drop-shadow-md">📦</span>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">No Image</span>
          </div>
        )}
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </Link>

      <div className="p-3 sm:p-5 md:p-6 flex flex-col flex-grow relative">

        {/* Category Badge */}
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-primary dark:text-primary mb-1.5 sm:mb-3">
          {product.category || "General"}
        </p>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-outfit text-[15px] sm:text-xl font-black text-foreground mb-1 sm:mb-2 line-clamp-2 cursor-pointer group-hover:text-primary transition-colors leading-tight tracking-tight">
            {product.name}
          </h3>
        </Link>

        {/* Description Snippet (if available) */}
        {product.description && (
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 sm:mb-4 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Variant Selection Pills */}
        {product.options && product.options.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-6 mt-1">
            {product.options.map((option, index) => (
              <button
                key={`${option.id}-${index}`}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedOption(option);
                }}
                className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all duration-300 ${selectedOption?.id === option.id
                    ? "bg-foreground border-foreground text-background shadow-md scale-105"
                    : "bg-transparent border-black/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-black/20 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Price & Action Section */}
        <div className="mt-2 sm:mt-4 pt-3 sm:pt-4 border-t border-black/5 dark:border-white/5">
          <div className="flex flex-col mb-2 sm:mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 font-mono">RM</span>

              {selectedOption ? (
                <span className="font-outfit text-lg sm:text-2xl font-black text-foreground tracking-tighter">
                  {selectedOption.price.toFixed(2)}
                </span>
              ) : isRange ? (
                <span className="font-outfit text-sm sm:text-lg font-black text-foreground tracking-tighter">
                  {minPrice.toFixed(2)} <span className="text-slate-400 font-medium px-1">—</span> {maxPrice.toFixed(2)}
                </span>
              ) : (
                <span className="font-outfit text-lg sm:text-2xl font-black text-foreground tracking-tighter">
                  {product.price.toFixed(2)}
                </span>
              )}
            </div>

            {!selectedOption && isRange && (
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 tracking-[0.1em] mt-0.5 sm:mt-1">
                Select option above
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white py-2.5 sm:py-4 rounded-xl sm:rounded-[1.25rem] text-xs sm:text-sm font-black tracking-wide shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.7)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 sm:gap-2 mt-1 sm:mt-2"
          >
            <ShoppingCart size={16} strokeWidth={2.5} className="group-hover/btn:-rotate-12 transition-transform duration-300 sm:w-[18px] sm:h-[18px]" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}