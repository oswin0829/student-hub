import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';
import ProductInteraction from '@/components/ProductInteraction';
import ExpandableDescription from '@/components/ExpandableDescription'; // Ensure this is imported

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !product) notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-28 pb-12 md:pt-32 md:pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* --- TOP SECTION: Purchase Focus --- */}
        <div className="flex flex-col lg:flex-row gap-16 mb-16 md:mb-24">
          
          {/* Left: Image Area */}
          <div className="lg:w-1/2 aspect-square bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center p-8 border border-gray-100 dark:border-gray-800">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
              />
            ) : (
              <div className="text-gray-300 dark:text-gray-700 font-black text-6xl">📦</div>
            )}
          </div>

          {/* Right: Details & Buying Logic */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            {/* Category Badge */}
            <div className="uppercase tracking-[0.3em] text-[10px] text-black dark:text-white font-black mb-4 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full w-fit">
              {product.category || "MegaHelper Tool"}
            </div>
            
            {/* Product Title - Now smaller and tighter */}
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              {product.name}
            </h1>
            
            {/* Short Tagline instead of full description */}
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">
              Verified Digital Asset • Instant Access
            </p>

            {/* Interaction (Variant Selector, Quantity & Add to Cart) */}
            <ProductInteraction product={product} />
            
            {/* Trust Badges - Moved closer to the button */}
            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1 rounded-md">✓</span> INSTANT EMAIL ACCESS
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                  <span className="bg-black dark:bg-white text-white dark:text-black p-1 rounded-md">✓</span> VERIFIED ASSET
               </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        {/* --- BOTTOM SECTION --- */}
        {/* --- BOTTOM SECTION --- */}
        <div className="pt-12 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
              <span className="w-8 h-px bg-black dark:bg-white"></span>
              Product Overview & Details
            </h2>
            
            {/* REMOVED 'prose' and 'prose-slate' here */}
            <div className="mt-4">
              <ExpandableDescription text={product.description} />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}