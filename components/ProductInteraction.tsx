"use client";

import { useState } from 'react';
import { Check } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import { toast } from 'sonner'; // Imported for validation feedback

// 1. Interfaces
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

interface ProductInteractionProps {
  product: Product;
  createPayment: (formData: FormData) => Promise<void>; 
}

export default function ProductInteraction({ product, createPayment }: ProductInteractionProps) {
  // 2. State initialized to null
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);

  // 3. Price Range Calculation
  const allPrices = product.options && product.options.length > 0 
    ? [product.price, ...product.options.map(opt => opt.price)]
    : [product.price];
    
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const isRange = minPrice !== maxPrice;
  const hasOptions = product.options && product.options.length > 0;

  // Active price for data payload
  const currentPrice = selectedOption ? selectedOption.price : product.price;

  // 4. Validation Gate for Billplz
  const handleCheckoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (hasOptions && !selectedOption) {
      e.preventDefault(); // Blocks the server action from firing
      toast.error(`Please select a plan for ${product.name}`, { icon: '⚠️' });
    }
  };

  // 5. Validation Gate for Cart
  const handleCartValidation = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasOptions && !selectedOption) {
      e.stopPropagation(); // Intercepts the click before AddToCartButton sees it
      e.preventDefault();
      toast.error(`Please select a plan for ${product.name}`, { icon: '⚠️' });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Dynamic Price & Range Display */}
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
        
        {/* Call to action text when unselected */}
        {!selectedOption && isRange && (
          <span className="text-sm font-bold text-blue-500 tracking-widest uppercase mt-2">
            Select an option below
          </span>
        )}
      </div>

      {/* --- Variant Selection Area --- */}
      {hasOptions && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Plan</p>
          <div className="grid grid-cols-1 gap-2">
            {product.options!.map((option: ProductOption) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedOption?.id === option.id
                    ? "border-blue-600 bg-blue-50/50 shadow-sm"
                    : "border-gray-100 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedOption?.id === option.id ? "border-blue-600 bg-blue-600" : "border-gray-300"
                  }`}>
                    {selectedOption?.id === option.id && <Check size={10} className="text-white" />}
                  </div>
                  <span className="font-bold text-gray-700">{option.label}</span>
                </div>
                <span className="font-mono font-bold text-gray-900">RM{option.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- Checkout & Cart Actions --- */}
      <div className="flex flex-col gap-3 pt-4">
        
        {/* Billplz Form with Validation */}
        <form action={createPayment} onSubmit={handleCheckoutSubmit}>
          <input type="hidden" name="amount" value={currentPrice} />
          <input type="hidden" name="name" value={`${product.name} (${selectedOption?.label || 'Standard'})`} />
          <input type="hidden" name="email" value="oswin.test@example.com" /> 

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            Pay with Billplz (FPX)
          </button>
        </form>

        {/* Cart Button wrapped in an Interceptor */}
        <div onClickCapture={handleCartValidation}>
          <AddToCartButton 
            product={{
              ...product,
              price: currentPrice,
              selectedLabel: selectedOption?.label,
              cartId: selectedOption ? `${product.id}-${selectedOption.id}` : `${product.id}`
            }} 
          />
        </div>
        
      </div>
    </div>
  );
}