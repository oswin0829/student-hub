import { create } from 'zustand';

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
  options?: ProductOption[];
}

interface CartItem {
  id: number;
  cartId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  selectedLabel?: string;
  variantLabel?: string;
  image_url?: string;
}

interface CartStore {
  cart: CartItem[];
  // Changed: We now allow the full CartItem (including quantity) to be passed in
  addToCart: (item: CartItem) => void; 
  removeFromCart: (cartId: string) => void; 
  updateQuantity: (cartId: string, quantity: number) => void;
  cartTotal: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  
  addToCart: (newItem) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.cartId === newItem.cartId);

      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.cartId === newItem.cartId 
              // FIXED: We now add the incoming quantity instead of just +1
              ? { ...item, quantity: item.quantity + (newItem.quantity || 1) } 
              : item
          ),
        };
      }
      
      // If it's new, we use the quantity provided from the ProductInteraction component
      return { cart: [...state.cart, { ...newItem, quantity: newItem.quantity || 1 }] };
    });
  },

  removeFromCart: (cartId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.cartId !== cartId),
    }));
  },


  updateQuantity: (cartId, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.cartId === cartId 
          ? { 
              ...item, 
              // Ensures quantity is at least 1 and at most 1000
              quantity: Math.max(1, Math.min(1000, quantity)) 
            } 
          : item
      ),
    }));
  },
  
  cartTotal: () => {
    // This looks good - it correctly calculates based on quantity
    return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  clearCart: () => set({ cart: [] }),
}));