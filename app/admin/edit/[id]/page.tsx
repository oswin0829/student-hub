"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Package, DollarSign, ArrowLeft, Tag, Plus, Trash2, Hash, AlertCircle, AlignLeft } from 'lucide-react';
import Link from 'next/link';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ProductOption = { id: string; label: string; price: number; };

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(''); 
  const [description, setDescription] = useState(''); // NEW: Description State
  const [options, setOptions] = useState<ProductOption[]>([]);

  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();
      if (data) {
        setName(data.name || '');
        setPrice(data.price?.toString() || '0');
        setCategory(data.category || ''); 
        setDescription(data.description || ''); // NEW: Fetch existing description
        setOptions(data.options || []);   
        setExistingImageUrl(data.image_url || '');
      } else if (error) {
        toast.error("Could not load product details.");
      }
      setFetching(false);
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddOption = () => {
    setOptions([...options, { id: '', label: '', price: 0 }]);
  };
  
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (options.some(opt => !opt.id || !opt.label || opt.price < 0)) {
      return toast.error("Please ensure all options have an ID, a Label, and a valid Price.");
    }

    setLoading(true);
    const toastId = toast.loading("Updating product...");

    try {
      let finalImageUrl = existingImageUrl;

      if (newImageFile) {
        const imageExt = newImageFile.name.split('.').pop();
        const imagePath = `${Math.random()}.${imageExt}`;
        const { error } = await supabase.storage.from('product-images').upload(imagePath, newImageFile);
        if (error) throw error;
        const { data } = supabase.storage.from('product-images').getPublicUrl(imagePath);
        finalImageUrl = data.publicUrl;
      }

      // Updated to include 'description'
      const { error: dbError } = await supabase
        .from('products')
        .update({ 
          name, 
          price: parseFloat(price), 
          category, 
          description, // NEW: Update description
          options, 
          image_url: finalImageUrl 
        })
        .eq('id', productId);
      
      if (dbError) throw dbError;

      toast.success("Product updated successfully!", { id: toastId });
      router.push('/admin');

    } catch (error: unknown) {
      console.error("SUPABASE ERROR:", error);
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(`Update failed: ${errorMessage}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you absolutely sure you want to delete this product? This action cannot be undone.")) {
      return; 
    }

    setLoading(true);
    const toastId = toast.loading("Deleting product...");

    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;

      toast.success("Product deleted permanently.", { id: toastId });
      router.push('/admin');
    } catch (error: unknown) {
      console.error("SUPABASE DELETE ERROR:", error);
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) errorMessage = error.message;
      toast.error(`Delete failed: ${errorMessage}`, { id: toastId });
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-12 text-center text-slate-400 font-bold">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 pb-24">
      <Link href="/admin" className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-2 mb-6 w-fit transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Edit Product</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Make changes and hit save.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Package size={14} /> Product Name
              </label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Tag size={14} /> Category
              </label>
              <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <DollarSign size={14} /> Base Price (RM)
              </label>
              <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none" />
            </div>

            {/* NEW: DESCRIPTION FIELD */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <AlignLeft size={14} /> Description
              </label>
              <textarea 
                required 
                rows={4} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Explain the features and usage of this tool..."
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none resize-none" 
              />
            </div>
          </div>

          {/* Variant Builder */}
          <div className="bg-slate-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-slate-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Product Options (Variants)</label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Define the ID, Label, and Price.</p>
              </div>
              <button type="button" onClick={handleAddOption} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-bold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors shadow-sm">
                <Plus size={14} /> Add Option
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {options.map((opt, index) => (
                  <motion.div key={index} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col sm:flex-row items-end gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mt-2">
                    <div className="flex flex-col w-full sm:w-[25%]">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Variant ID</label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-2.5">
                        <Hash size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
                        <input type="text" placeholder="e.g. 1m" value={opt.id} onChange={(e) => handleUpdateOption(index, 'id', e.target.value)} className="w-full text-sm outline-none bg-transparent font-mono text-slate-700 dark:text-white" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col w-full sm:flex-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Display Label</label>
                      <input type="text" placeholder="e.g. 1 Month Access" value={opt.label} onChange={(e) => handleUpdateOption(index, 'label', e.target.value)} className="w-full text-sm outline-none bg-slate-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-2.5 font-semibold text-slate-700 dark:text-white" />
                    </div>
                    
                    <div className="flex flex-col w-full sm:w-[25%]">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Price</label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-2.5">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">RM</span>
                        <input type="number" placeholder="10.00" value={opt.price} onChange={(e) => handleUpdateOption(index, 'price', parseFloat(e.target.value) || 0)} className="w-full text-sm outline-none bg-transparent font-mono text-slate-700 dark:text-white" />
                      </div>
                    </div>
                    
                    <button type="button" onClick={() => handleRemoveOption(index)} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shadow-sm transition-all w-full sm:w-auto flex justify-center items-center h-[42px]">
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Image Preview */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">Product Thumbnail</label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-40 h-40 rounded-2xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 overflow-hidden shrink-0 flex items-center justify-center relative shadow-sm">
                {(newImageFile || existingImageUrl) ? (
                  <img 
                    src={newImageFile ? URL.createObjectURL(newImageFile) : existingImageUrl} 
                    alt="Product Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-slate-400 dark:text-slate-500">
                    <Package size={24} className="mx-auto mb-1 opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex flex-col justify-center items-center h-40">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">Replace Image</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Select a new file to overwrite the current thumbnail.</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setNewImageFile(e.target.files?.[0] || null)} 
                  className="max-w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gray-100 dark:file:bg-gray-800 file:text-black dark:file:text-white hover:file:bg-gray-200 dark:hover:file:bg-gray-700" 
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl mt-8 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-md">
            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
          </button>
        </form>

        {/* Danger Zone */}
        <div className="mt-12 pt-8 border-t border-red-100 dark:border-red-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle size={16} /> Danger Zone
            </h3>
            <p className="text-xs text-red-400 dark:text-red-500 mt-1">Permanently delete this product from the database.</p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-800 hover:text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/50 hover:border-red-600 w-full sm:w-auto"
          >
            <Trash2 size={16} /> Delete Product
          </button>
        </div>
      </motion.div>
    </div>
  );
}