import { supabase } from '@/utils/supabase';
import Storefront from '@/components/Storefront';
import * as motion from "framer-motion/client";
import { Shield, Clock, MousePointer2 } from 'lucide-react';

export default async function Home() {
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error("Error fetching products:", error);
    return <div className="p-12 text-center text-red-500 font-bold">Failed to load products.</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* --- ENHANCED ATMOSPHERIC HERO --- */}
      <div className="relative pt-28 pb-20 bg-white overflow-hidden">
        
        {/* 1. Background Texture: Subtle Blueprint Grid */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '30px 30px' }} 
        />

        {/* 2. Expanded Atmospheric Glows (Pushed further to the edges) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[70%] bg-blue-100/40 rounded-full blur-[120px]" />
          <div className="absolute top-[10%] right-[-10%] w-[45%] h-[70%] bg-indigo-100/30 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="relative max-w-4xl mx-auto text-center">
            
            {/* 3. Decorative Floating Badges - These fill the blank side space on Desktop */}
            <div className="hidden xl:block">
              {/* Left Side Badge */}
              <motion.div 
                animate={{ y: [0, -12, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-32 top-10 p-4 bg-white rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3"
              >
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <Shield size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Status</p>
                  <p className="text-xs font-bold text-gray-900">Verified Seller</p>
                </div>
              </motion.div>

              {/* Right Side Badge */}
              <motion.div 
                animate={{ y: [0, 12, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-32 top-32 p-4 bg-white rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3"
              >
                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                  <Clock size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Delivery</p>
                  <p className="text-xs font-bold text-gray-900">Instant Access</p>
                </div>
              </motion.div>
            </div>

            {/* --- Main Content --- */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-6 block">
                Exceptional Service • Verified Reliability
              </span>

              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-[1.1]">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-[length:200%_auto] animate-gradient">
                  MegaHelper
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto mb-10">
                Your destination for high-quality digital assets. <br />
                Built on trust and dedicated to your success.
              </p>
              
              {/* Subtle Visual Anchor */}
              <div className="flex justify-center items-center gap-3 text-gray-300">
                 <div className="h-px w-10 bg-gradient-to-r from-transparent to-current" />
                 <MousePointer2 size={16} className="rotate-12 opacity-40" />
                 <div className="h-px w-10 bg-gradient-to-l from-transparent to-current" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- STOREFRONT SECTION --- */}
      <div className="bg-gray-50/40 border-t border-gray-100">
        <Storefront initialProducts={products || []} />
      </div>
    </main>
  );
}