"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Package, DollarSign, ArrowLeft, Tag, Plus, Trash2, Hash, AlignLeft } from 'lucide-react';
import Link from 'next/link';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ProductOption = { id: string; label: string; price: number; };

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState(''); // NEW: Description State
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddOption = () => setOptions([...options, { id: '', label: '', price: 0 }]);
  
  const handleUpdateOption = (index: number, field: keyof ProductOption, value: string | number) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please upload a product thumbnail image.");
    if (options.some(opt => !opt.id || !opt.label || opt.price < 0)) {
      return toast.error("Please ensure all variants have valid details.");
    }
    
    setLoading(true);
    const toastId = toast.loading("Publishing product...");

    try {
      // 1. Upload the image
      const imagePath = `${Math.random()}.${imageFile.name.split('.').pop()}`;
      const { error: imgError } = await supabase.storage.from('product-images').upload(imagePath, imageFile);
      if (imgError) throw imgError;
      
      const { data: { publicUrl: imageUrl } } = supabase.storage.from('product-images').getPublicUrl(imagePath);

      // 2. Save to database (Now including 'description')
      const { error: dbError } = await supabase.from('products').insert([{
        name, 
        price: parseFloat(price), 
        category, 
        description, // NEW: Insert description
        options, 
        image_url: imageUrl
      }]);

      if (dbError) throw dbError;
      
      toast.success("Product published successfully!", { id: toastId });
      router.push('/admin');

    } catch (error: unknown) {
      console.error("SUPABASE ERROR:", error);
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) errorMessage = error.message;
      toast.error(`Upload failed: ${errorMessage}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 pb-24">
      <Link href="/admin" className="text-sm font-bold text-slate-400 hover:text-slate-800 flex items-center gap-2 mb-6 w-fit transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900">Add New Product</h1>
          <p className="text-slate-500 text-sm mt-1">Create a new digital asset.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- MAIN DETAILS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Package size={14} /> Product Name
              </label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Tag size={14} /> Category
              </label>
              <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <DollarSign size={14} /> Base Price (RM)
              </label>
              <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>

            {/* NEW: DESCRIPTION FIELD */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <AlignLeft size={14} /> Description
              </label>
              <textarea 
                required 
                rows={4} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Explain the features, benefits, and usage of this tool..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none resize-none" 
              />
            </div>
          </div>

          {/* --- VARIANT BUILDER --- */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <label className="text-sm font-bold text-slate-700 block">Product Options (Variants)</label>
                <p className="text-xs text-slate-500">Define IDs, labels, and pricing tiers.</p>
              </div>
              <button type="button" onClick={handleAddOption} className="bg-white border border-gray-200 text-sm font-bold text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-100 transition-colors shadow-sm">
                <Plus size={14} /> Add Option
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {options.map((opt, index) => (
                  <motion.div key={index} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative flex flex-col sm:flex-row items-start gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm mt-2">
                    <div className="flex flex-col w-full sm:w-[25%]">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Variant ID</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-gray-100 rounded-lg p-2.5">
                        <Hash size={14} className="text-slate-400 shrink-0" />
                        <input type="text" placeholder="v1" value={opt.id} onChange={(e) => handleUpdateOption(index, 'id', e.target.value)} className="w-full text-sm outline-none bg-transparent font-mono text-slate-700" />
                      </div>
                    </div>

                    <div className="flex flex-col w-full sm:w-[45%]">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Display Label</label>
                      <input type="text" placeholder="e.g. 1 Month" value={opt.label} onChange={(e) => handleUpdateOption(index, 'label', e.target.value)} className="w-full text-sm outline-none bg-slate-50 border border-gray-100 rounded-lg p-2.5 font-semibold text-slate-700" />
                    </div>

                    <div className="flex flex-col w-full sm:w-[30%]">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Price</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-gray-100 rounded-lg p-2.5">
                        <span className="text-xs font-bold text-slate-400">RM</span>
                        <input type="number" placeholder="10.00" value={opt.price} onChange={(e) => handleUpdateOption(index, 'price', parseFloat(e.target.value) || 0)} className="w-full text-sm outline-none bg-transparent font-mono text-slate-700" />
                      </div>
                    </div>

                    <button type="button" onClick={() => handleRemoveOption(index)} className="absolute -top-3 -right-3 bg-white border border-gray-200 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1.5 shadow-sm transition-colors z-10">
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {options.length === 0 && (
                <div className="text-center py-6 text-xs font-bold text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-xl bg-white">
                  No Variants Added
                </div>
              )}
            </div>
          </div>

          {/* --- THUMBNAIL UPLOAD --- */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Thumbnail</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
              <input type="file" accept="image/*" required onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-8 hover:bg-blue-700 transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg">
            {loading ? 'Publishing...' : <><UploadCloud size={18} /> Publish Product</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}