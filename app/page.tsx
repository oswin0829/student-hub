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
    <main className="min-h-screen bg-background text-foreground">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-24 overflow-hidden">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none text-black dark:text-white" 
          style={{ backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="relative max-w-4xl mx-auto text-center">
            
            {/* Animated Aurora Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] pointer-events-none flex items-center justify-center mix-blend-multiply dark:mix-blend-screen opacity-70">
              <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-primary/20 dark:bg-primary/30 blur-[100px] rounded-full" />
              <motion.div animate={{ rotate: -360, scale: [1, 1.5, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-violet-400/20 dark:bg-violet-600/30 blur-[100px] rounded-full translate-x-32" />
            </div>

            {/* Floating Badges */}
            <div className="hidden xl:block">
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-32 top-10 p-4 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-premium dark:shadow-premium-dark border border-black/5 dark:border-white/10 flex items-center gap-3">
                <div className="bg-black/5 dark:bg-white/10 p-2 rounded-lg text-black dark:text-white"><Shield size={20} /></div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">Status</p>
                  <p className="text-xs font-bold text-black dark:text-white">Verified Seller</p>
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -right-32 top-32 p-4 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-premium dark:shadow-premium-dark border border-black/5 dark:border-white/10 flex items-center gap-3">
                <div className="bg-black/5 dark:bg-white/10 p-2 rounded-lg text-black dark:text-white"><Clock size={20} /></div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">Delivery</p>
                  <p className="text-xs font-bold text-black dark:text-white">Instant Access</p>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary dark:text-primary mb-6 block">Exceptional Service • Verified Reliability</span>
              <h1 className="font-outfit text-6xl md:text-8xl font-black text-black dark:text-white mb-8 tracking-tighter leading-[1.05]">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500 dark:from-primary dark:to-violet-400">MegaHelper</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto mb-10">
                Your destination for high-quality digital assets. <br /> Built on trust and dedicated to your success.
              </p>
              <div className="flex justify-center items-center gap-3 text-slate-300 dark:text-slate-700">
                 <div className="h-px w-10 bg-gradient-to-r from-transparent to-current" />
                 <MousePointer2 size={16} className="rotate-12 opacity-40 text-black dark:text-white" />
                 <div className="h-px w-10 bg-gradient-to-l from-transparent to-current" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- STOREFRONT SECTION --- */}
      <div className="border-t border-gray-100 dark:border-gray-900 bg-background relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] dark:shadow-[0_-10px_40px_rgba(255,255,255,0.01)]">
        <Storefront initialProducts={products || []} />
      </div>
    </main>
  );
}