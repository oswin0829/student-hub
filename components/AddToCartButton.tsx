"use client";

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

// Define the shape of the data this button expects
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  cartId?: string;      // Optional because it might be generated in the button
  selectedLabel?: string; 
  variantLabel?: string;
  quantity?: number;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    
    // 1. Generate the unique ID. 
    // If the parent component (like ProductInteraction) provided a cartId, use it.
    // Otherwise, fallback to the raw product ID (for simple products without variants).
    const uniqueCartId = product.cartId || String(product.id);
    
    // 2. Extract the label so the cart knows what to display.
    const label = product.variantLabel || product.selectedLabel || "Standard";

    // 3. Build the exact payload expected by the Zustand store
    const itemToAdd = {
      id: product.id,
      cartId: uniqueCartId,
      name: product.name,
      price: product.price,
      category: product.category || "General",
      image_url: product.image_url,
      selectedLabel: label, // Ensures the cart shows "(3 Months)" etc.
    };

    // 4. Send to the store
    addToCart(itemToAdd);
    
    // 5. Fire the success feedback
    toast.success(`Added ${product.name} (${label}) to cart!`);
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 flex items-center justify-center gap-3"
    >
      <ShoppingCart size={24} strokeWidth={2.5} />
      Add to Cart
    </button>
  );
}