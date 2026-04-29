"use client";

import { useState, useEffect } from 'react'; 
import { useCartStore } from '@/store/cartStore';
import { createPayment } from '@/app/actions/checkout';
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr'; 
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function CheckoutPage() {
  const { cart, cartTotal, removeFromCart, clearCart, updateQuantity } = useCartStore();
  
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        setIsLoggedIn(true);
      }
    });
  }, []);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <ShoppingBag size={64} className="text-slate-300 dark:text-slate-700 mb-6" />
        <h1 className="font-outfit text-3xl font-black mb-2">Your cart is empty</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md">
          Looks like you have not added any items to your cart yet.
        </p>
        <Link 
          href="/"
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold transition-all shadow-premium"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-32 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-8 overflow-hidden">
          <h1 className="font-outfit text-4xl font-black tracking-tight">Checkout</h1>
          
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
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-2">
                    Are you sure?
                  </span>
                  <button 
                    onClick={() => setIsConfirmingClear(false)}
                    className="text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      clearCart();
                      setIsConfirmingClear(false);
                    }}
                    className="text-sm font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 px-4 py-2 rounded-full transition-colors shadow-sm"
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
                  className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear Cart
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12">
          
          {/* LEFT SIDE: Payment Form (Stripe Style) */}
          <div className="xl:col-span-7 h-fit order-2 xl:order-1">
            <div className="bg-white/50 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] shadow-premium dark:shadow-premium-dark border border-black/5 dark:border-white/5 p-8 md:p-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-primary/10 text-primary p-3.5 rounded-full">
                  <Lock size={24} />
                </div>
                <div>
                  <h2 className="font-outfit text-3xl font-black text-foreground tracking-tight">Secure Checkout</h2>
                  <p className="text-sm font-medium text-slate-500">Powered by Billplz FPX</p>
                </div>
              </div>
              
              <form action={createPayment} className="space-y-10">
                <input type="hidden" name="amount" value={cartTotal()} />
                <input type="hidden" name="cartData" value={JSON.stringify(cart)} />
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-3">
                      Personal Information
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-5 py-4 rounded-2xl border border-black/5 dark:border-white/10 focus:ring-4 focus:ring-primary/10 focus:border-primary bg-white dark:bg-black/50 text-foreground outline-none transition-all shadow-inner placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-end justify-between mb-3">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                        Digital Delivery Address
                      </label>
                    </div>
                    
                    {!userEmail && (
                      <div className="flex items-end justify-between mb-3">
                        <Link 
                          href="/login?redirect=/checkout" 
                          className="text-[11px] font-black text-primary hover:text-primary-hover transition-colors"
                        >
                          Sign In / Create Account for faster checkout
                        </Link>
                      </div>
                    )}
                    
                    {isLoggedIn && userEmail ? (
                      <div className="bg-white/80 dark:bg-black/80 border border-black/5 dark:border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
                            Sending files to
                          </span>
                          <span className="text-base font-bold text-foreground">
                            {userEmail}
                          </span>
                        </div>
                        <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <CheckCircle2 size={12} strokeWidth={3} />
                          VERIFIED
                        </div>
                        <input type="hidden" name="email" value={userEmail} />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input 
                          type="email" 
                          name="email" 
                          required
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="Email Address"
                          className="w-full px-5 py-4 rounded-2xl border border-black/5 dark:border-white/10 focus:ring-4 focus:ring-primary/10 focus:border-primary bg-white dark:bg-black/50 text-foreground outline-none transition-all shadow-inner placeholder:text-slate-400"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-start gap-4 bg-primary/5 border border-primary/10 p-5 rounded-2xl mb-8">
                    <AlertCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                      You will be redirected to Billplz to securely complete your payment. Your digital tools will be delivered instantly upon verification.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    disabled={cart.length === 0}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary-hover transition-all active:scale-[0.98] shadow-premium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                  >
                    <span>Pay RM{cartTotal().toFixed(2)}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE: Order Summary */}
          <div className="xl:col-span-5 order-1 xl:order-2">
            <div className="bg-white dark:bg-[#111113] rounded-[2.5rem] shadow-premium dark:shadow-premium-dark border border-black/5 dark:border-white/5 overflow-hidden sticky top-32">
              <div className="p-8 pb-6 border-b border-black/5 dark:border-white/5">
                <h2 className="font-outfit text-2xl font-black flex items-center gap-3">
                  <ShoppingBag size={24} className="text-primary" /> 
                  Your Order
                </h2>
              </div>
              
              <div className="p-8 flex flex-col gap-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div 
                      layout 
                      key={item.cartId}
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95, overflow: 'hidden' }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="flex gap-4"
                    >
                      <div className="relative w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                        {item.image_url ? (
                          <Image 
                            src={item.image_url} 
                            alt={item.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag size={24} className="text-slate-300 dark:text-slate-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold leading-tight text-foreground line-clamp-1">{item.name}</p>
                          <span className="font-mono font-black text-foreground pl-2">
                            RM{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3">
                          {item.variantLabel || item.selectedLabel || "Standard Config"}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          {/* QUANTITY CONTROLS */}
                          <div className="flex items-center border border-black/5 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50 backdrop-blur-sm p-0.5 shadow-inner">
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              className="p-1.5 text-slate-400 hover:text-foreground hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            
                            <span className="w-8 text-center font-mono font-bold text-sm">
                              {item.quantity}
                            </span>
                            
                            <button 
                              type="button"
                              onClick={() => {
                                if (item.quantity < 1000) {
                                    updateQuantity(item.cartId, item.quantity + 1);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-foreground hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                              disabled={item.quantity >= 1000}
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>

                          <button 
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="bg-slate-50/50 dark:bg-black/20 p-8 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <span className="font-outfit text-lg font-bold text-slate-500">Total</span>
                  <span className="font-outfit text-4xl font-black tracking-tighter text-foreground">
                    RM{cartTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}