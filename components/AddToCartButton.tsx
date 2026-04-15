"use client";

import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  variantLabel?: string;
  selectedLabel?: string;
  cartId: string;
  // --- ADD THIS ---
  quantity?: number; 
}

export default function AddToCartButton({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const label = product.variantLabel || product.selectedLabel || "Standard";

    // --- FIX: Include quantity in this object ---
    const itemToAdd = {
      id: product.id,
      cartId: product.cartId,
      name: product.name,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      selectedLabel: label,
      // Default to 1 if for some reason quantity is missing
      quantity: product.quantity || 1, 
    };

    addToCart(itemToAdd);
    toast.success(`Added ${product.name} (${label}) to cart!`);
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
    >
      <ShoppingCart size={24} strokeWidth={2.5} />
      <span>Add to Cart</span>
    </button>
  );
}