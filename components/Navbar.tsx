"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, LogOut } from 'lucide-react'; // Added LogOut icon
import { useCartStore } from '@/store/cartStore';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Navbar() {
  const { cart } = useCartStore();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // State to hold the logged-in user
  const [user, setUser] = useState<any>(null);

  // Listen for login/logout events
  useEffect(() => {
    // 1. Check if they are logged in on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Listen for live changes (like when they submit the login form)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // No need to redirect, the listener above will instantly update the UI!
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* --- BRANDING SECTION --- */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-12 h-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[15deg]">
              <Image src="/logo.png" alt="MegaHelper Store Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 leading-none tracking-tighter">
                MĒGA HELPER
              </span>
              <span className="text-[10px] font-bold uppercase text-blue-600 tracking-[0.3em] -mt-0.5">
                Digital Assets
              </span>
            </div>
          </Link>

          {/* --- ACTIONS SECTION --- */}
          <div className="flex items-center gap-6 md:gap-8">
            
            {/* Conditional User UI */}
            {user ? (
              <div className="flex items-center gap-4 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                {/* User Avatar Circle (First letter of email) */}
                <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                  {user.email?.charAt(0)}
                </div>
                {/* User Email */}
                <span className="hidden md:block text-sm font-bold text-slate-700 max-w-[120px] truncate">
                  {user.email}
                </span>
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={18} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center gap-2 text-base font-bold text-gray-500 hover:text-blue-600 transition-colors group"
              >
                <User size={22} strokeWidth={2.5} className="group-hover:translate-y-[-1px] transition-transform" />
                <span className="hidden md:block">Login</span>
              </Link>
            )}

            {/* Cart Icon */}
            <Link 
              href="/checkout" 
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-all active:scale-90"
            >
              <ShoppingCart size={28} strokeWidth={2.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}