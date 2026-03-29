"use client";

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner'; // 1. Swapped to the correct Sonner import

export default function AddToCartButton({ product }: { product: any }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    
    // 1. Logic: Add to the Zustand store
    addToCart(product);
    
    // 2. Feedback: Fire the Sonner toast
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors active:scale-95 flex items-center justify-center gap-3 font-bold text-lg w-full md:w-auto"
    >
      <ShoppingCart size={24} />
      Add to Cart
    </button>
  );
}