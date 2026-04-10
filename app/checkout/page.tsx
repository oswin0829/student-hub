"use client";

import { useState, useEffect } from 'react'; 
import { useCartStore } from '@/store/cartStore';
import { createPayment } from '@/app/actions/checkout';
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr'; 
import { motion, AnimatePresence } from 'framer-motion';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function CheckoutPage() {
  const { cart, cartTotal, removeFromCart, clearCart, updateQuantity } = useCartStore();
  
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });
  }, []);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <ShoppingBag size={64} className="text-gray-300 mb-6" />
        <h1 className="text-2xl font-black text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-8 text-center max-w-md">
          Looks like you have not added any MegaHelper tools to your cart yet.
        </p>
        <Link 
          href="/"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* The Upgraded Header Area with Inline Morphing Confirmation */}
        <div className="flex items-center justify-between mb-8 overflow-hidden">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
          
          <div className="flex items-center h-10">
            <AnimatePresence mode="popLayout" initial={false}>
              {isConfirmingClear ? (
                <motion.div
                  key="confirm-actions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                    Are you sure?
                  </span>
                  <button 
                    onClick={() => setIsConfirmingClear(false)}
                    className="text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      clearCart();
                      setIsConfirmingClear(false);
                    }}
                    className="text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    Yes, Empty
                  </button>
                </motion.div>
              ) : (
                <motion.button 
                  key="clear-btn"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  onClick={() => setIsConfirmingClear(true)}
                  className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear Cart
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          <div className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingBag size={20} className="text-blue-600" /> 
              Order Summary
            </h2>
            
            <div className="flex flex-col pt-2">
              <AnimatePresence initial={false}>
                {cart.map((item) => (
                  <motion.div 
                    layout 
                    key={item.cartId}
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95, overflow: 'hidden' }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-0"
                  >
                    
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 leading-snug">{item.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mt-1 bg-blue-50 w-fit px-2 py-0.5 rounded-md">
                        {item.variantLabel || item.selectedLabel || "Standard Config"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
                      
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/50 p-1">
                        <button 
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-sm text-slate-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded transition-colors"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 w-28 justify-end">
                        <span className="font-mono font-bold text-slate-900">
                          RM{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-slate-50 p-6 md:p-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-slate-600">Total to pay</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">
                RM{cartTotal().toFixed(2)}
              </span>
            </div>

            <form action={createPayment} className="space-y-4">
              <input type="hidden" name="amount" value={cartTotal()} />
              <input type="hidden" name="name" value="MegaHelper Digital Tools Order" />
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Delivery Details
                </label>
                
                {userEmail ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Digital Delivery To
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        {userEmail}
                      </span>
                    </div>
                    <div className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} strokeWidth={3} />
                      VERIFIED
                    </div>
                    <input type="hidden" name="email" value={userEmail} />
                  </div>
                ) : (
                  <input 
                    type="email" 
                    name="email" 
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  />
                )}
              </div>

              <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  Secure checkout via Billplz. Your digital product will be sent instantly to the email provided above after successful payment.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 mt-4"
              >
                Pay RM{cartTotal().toFixed(2)}
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}