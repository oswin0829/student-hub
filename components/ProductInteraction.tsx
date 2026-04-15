"use client";

import { useState } from 'react';
import { Check } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import { toast } from 'sonner';

// 1. Strict Interfaces
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
  description?: string; // Add this line!
  options?: ProductOption[];
}

interface ProductInteractionProps {
  product: Product;
}

export default function ProductInteraction({ product }: ProductInteractionProps) {
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);

  const hasOptions = product.options && product.options.length > 0;
  const currentPrice = selectedOption ? selectedOption.price : product.price;

  // Logic for the price range display
  const allPrices = hasOptions 
    ? [product.price, ...product.options!.map(opt => opt.price)]
    : [product.price];
    
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const isRange = minPrice !== maxPrice;

  // Validation Gate for Cart
  const handleCartValidation = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasOptions && !selectedOption) {
      e.stopPropagation();
      e.preventDefault();
      toast.error(`Please select a plan for ${product.name}`, { icon: '⚠️' });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* 1. Dynamic Price Display */}
      <div className="flex flex-col gap-1">
        {selectedOption ? (
          <div className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter transition-all">
            RM{selectedOption.price.toFixed(2)}
          </div>
        ) : isRange ? (
          <div className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
            RM{minPrice.toFixed(2)} — {maxPrice.toFixed(2)}
          </div>
        ) : (
          <div className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
            RM{product.price.toFixed(2)}
          </div>
        )}
        
        {!selectedOption && isRange && (
          <span className="text-sm font-bold text-blue-500 tracking-widest uppercase mt-2">
            Select an option below
          </span>
        )}
      </div>

      {/* 2. Variant Selection Area */}
      {hasOptions && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Plan</p>
          <div className="grid grid-cols-1 gap-2">
            {product.options!.map((option: ProductOption) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOption(option)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedOption?.id === option.id
                    ? "border-blue-600 bg-blue-50/50 shadow-sm"
                    : "border-gray-100 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedOption?.id === option.id ? "border-blue-600 bg-blue-600" : "border-gray-300"
                  }`}>
                    {selectedOption?.id === option.id && <Check size={12} className="text-white" strokeWidth={4} />}
                  </div>
                  <span className="font-bold text-gray-700">{option.label}</span>
                </div>
                <span className="font-mono font-bold text-gray-900">RM{option.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Single Action: Add to Cart */}
      <div className="pt-2">
        <div onClickCapture={handleCartValidation}>
          <AddToCartButton 
            product={{
              ...product,
              price: currentPrice,
              selectedLabel: selectedOption?.label,
              // Unique ID for the cart to distinguish between different variants of same product
              cartId: selectedOption ? `${product.id}-${selectedOption.id}` : `${product.id}`
            }} 
          />
        </div>
      </div>

    </div>
  );
}