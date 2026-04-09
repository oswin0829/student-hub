import { create } from 'zustand';

// 1. Define the option structure
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

// 2. Define the CartItem with a unique cartId
interface CartItem {
  id: number;          // Original database ID
  cartId: string;      // Unique key: e.g., "5-1m" or "5-standard"
  name: string;
  price: number;       // The specific price of the variant
  quantity: number;
  category: string;
  selectedLabel?: string; // e.g., "3 Months"
}

interface CartStore {
  cart: CartItem[];
  // We take the quantity out of the argument because we handle it inside the function
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (cartId: string) => void; 
  // --- NEW: Quantity updater ---
  updateQuantity: (cartId: string, quantity: number) => void;
  cartTotal: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  
  addToCart: (newItem) => {
    set((state) => {
      // CRITICAL FIX: Find by cartId (string) instead of id (number)
      const existingItem = state.cart.find((item) => item.cartId === newItem.cartId);

      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.cartId === newItem.cartId 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          ),
        };
      }
      
      // If it's a new unique combination, add it with quantity 1
      return { cart: [...state.cart, { ...newItem, quantity: 1 }] };
    });
  },

  removeFromCart: (cartId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.cartId !== cartId),
    }));
  },

  // --- NEW: Implementation for updating quantity ---
  updateQuantity: (cartId, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.cartId === cartId 
          // Use Math.max to prevent the quantity from dropping below 1
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      ),
    }));
  },
  
  cartTotal: () => {
    return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  clearCart: () => set({ cart: [] }),
}));