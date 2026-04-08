import { supabase } from '@/utils/supabase';
import Storefront from '@/components/Storefront';
import * as motion from "framer-motion/client"; // Use client-side motion for the text

export default async function Home() {
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error("Error fetching products:", error);
    return <div className="p-12 text-center text-red-500">Failed to load products.</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* --- PREMIUM HERO SECTION --- */}
      <div className="relative pt-24 pb-16 bg-white overflow-hidden">
        {/* Decorative Atmospheric Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-blue-100/40 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[50%] bg-indigo-100/30 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter leading-[1.05]">
              Build Faster with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-[length:200%_auto] animate-gradient">
                MegaHelper
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
              The ultimate toolbox for students and creators. Instant access to premium digital assets designed to supercharge your workflow.
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- STOREFRONT SECTION --- */}
      <div className="bg-gray-50/50 border-t border-gray-100">
        <Storefront initialProducts={products || []} />
      </div>
    </main>
  );
}