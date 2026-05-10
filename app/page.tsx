import { supabase } from '@/utils/supabase';
import Storefront from '@/components/Storefront';
import * as motion from "framer-motion/client";
import { Shield, Clock, MousePointer2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
              <h1 className="font-outfit text-6xl md:text-8xl font-black text-black dark:text-white mb-6 tracking-tighter leading-[1.05]">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500 dark:from-primary dark:to-violet-400">MegaHelper</span>
              </h1>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                className="mb-8 inline-block"
              >
                <Link 
                  href="/login"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 dark:border-emerald-400/20 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] relative overflow-hidden group cursor-pointer transition-all active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
                    🎉 10% OFF First Purchase
                  </span>
                  <span className="text-xs font-bold text-emerald-700/60 dark:text-emerald-300/50 hidden md:inline-block border-l border-emerald-500/20 pl-3">
                    Auto-applies at checkout
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full hidden sm:inline-flex items-center gap-1 shadow-sm ml-1 group-hover:scale-105 transition-transform">
                    Claim & Sign Up <ArrowRight size={12} strokeWidth={3} />
                  </span>
                </Link>
              </motion.div>

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