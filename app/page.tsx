import { supabase } from '@/utils/supabase';
import Storefront from '@/components/Storefront';
import * as motion from "framer-motion/client";
import { Shield, Clock, MousePointer2 } from 'lucide-react';

export default async function Home() {
  // We fetch all products once on the server
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('category', { ascending: true }); // Pre-sort by category alphabetically

  if (error) {
    console.error("Error fetching products:", error);
    return <div className="p-12 text-center text-red-500 font-bold">Failed to load products.</div>;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {/* --- HERO SECTION (Kept your exact design) --- */}
      <div className="relative pt-28 pb-20 bg-white dark:bg-black overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-10 pointer-events-none text-black dark:text-white" 
          style={{ backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="hidden xl:block">
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-32 top-10 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-black dark:text-white"><Shield size={20} /></div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Status</p>
                  <p className="text-xs font-bold text-black dark:text-white">Verified Seller</p>
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -right-32 top-32 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-black dark:text-white"><Clock size={20} /></div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Delivery</p>
                  <p className="text-xs font-bold text-black dark:text-white">Instant Access</p>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black dark:text-white mb-6 block">Exceptional Service • Verified Reliability</span>
              <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-8 tracking-tighter leading-[1.1]">
                Welcome to <br />
                <span>MegaHelper</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto mb-10">
                Your destination for high-quality digital assets. <br /> Built on trust and dedicated to your success.
              </p>
              <div className="flex justify-center items-center gap-3 text-gray-300 dark:text-gray-700">
                 <div className="h-px w-10 bg-gradient-to-r from-transparent to-current" />
                 <MousePointer2 size={16} className="rotate-12 opacity-40 text-black dark:text-white" />
                 <div className="h-px w-10 bg-gradient-to-l from-transparent to-current" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- STOREFRONT SECTION --- */}
      <div className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <Storefront initialProducts={products || []} />
      </div>
    </main>
  );
}