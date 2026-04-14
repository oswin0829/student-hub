import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';
import { createPayment } from '@/app/actions/checkout';
import ProductInteraction from '@/components/ProductInteraction'; // Import the new client component

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !product) notFound();

  return (
    <main className="min-h-screen bg-white py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left: Image (Cleaned up the UI) */}
          <div className="lg:w-1/2 aspect-square bg-gray-50 rounded-3xl flex items-center justify-center p-8 border border-gray-100">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
            ) : (
              <div className="text-gray-300 font-black text-6xl">📦</div>
            )}
          </div>

          {/* Right: Details & Interaction */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="uppercase tracking-[0.3em] text-[10px] text-blue-600 font-black mb-4 px-3 py-1 bg-blue-50 rounded-full w-fit">
              {product.category || "MegaHelper Tool"}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              {product.name}
            </h1>
            
            <p className="text-gray-500 mb-10 leading-relaxed text-lg font-medium">
              High-efficiency automation asset from the **MegaHelper** ecosystem. 
              Verified digital delivery.
            </p>

            {/* --- THIS HANDLES THE VARIANT LOGIC NOW --- */}
            <ProductInteraction product={product} />
            
            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <span className="bg-green-100 text-green-600 p-1 rounded">✓</span> INSTANT EMAIL ACCESS
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded">✓</span> VERIFIED ASSET
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}