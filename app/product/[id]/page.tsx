import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

// Next.js passes the URL parameters (like the ID) into this component
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the parameters (required in Next.js 15+)
  const resolvedParams = await params;

  // Fetch the single product where the ID matches the URL
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Image Rendering */}
          <div className="md:w-1/2 bg-gray-50 min-h-[400px] flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover shadow-inner"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                   <span className="text-gray-400">?</span>
                </div>
                <span className="text-gray-400 font-medium text-lg italic">No Image Available</span>
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="uppercase tracking-wide text-xs text-blue-600 font-bold mb-2 px-2 py-1 bg-blue-50 rounded-md inline-block self-start">
              {product.category || "MegaHelper Tool"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              This digital tool is a part of the **MegaHelper** ecosystem, designed for high-efficiency workflows. 
              Get exclusive pricing and instant delivery to your inbox.
            </p>

            <div className="text-4xl font-black text-gray-900 mb-8">
              RM{product.price.toFixed(2)}
            </div>

            {/* Interactive Add to Cart Component */}
            <div className="w-full max-w-sm">
              <AddToCartButton product={product} />
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-500 text-lg">⚡️</span>
                <p><span className="font-semibold text-gray-700">Instant Delivery:</span> Sent to your email immediately.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500 text-lg">🛡️</span>
                <p><span className="font-semibold text-gray-700">MegaHelper Verified:</span> Guaranteed working digital assets.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}