"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr'; 
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

type AuthMode = 'sign_in' | 'sign_up';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/');
    });
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (authMode === 'sign_in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(`Login Failed: ${error.message}`);
      } else {
        toast.success("Welcome back!");
        router.push('/');
        router.refresh();
      }
    } else {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(`Signup Failed: ${error.message}`);
      } else {
        toast.success("Account created successfully!");
        router.push('/');
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div 
        layout 
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden"
      >
        
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-4 transition-transform duration-500 hover:rotate-12">
            <Image src="/logo.png" alt="MegaHelper Logo" fill className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">MĒGA HELPER</h1>
        </div>

        {/* The Segmented Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8">
          <button
            type="button"
            onClick={() => setAuthMode('sign_in')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
              authMode === 'sign_in' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('sign_up');
              setConfirmPassword(''); 
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
              authMode === 'sign_up' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Manual Form Engine */}
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-600 font-bold text-xs uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-600 font-bold text-xs uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          <AnimatePresence>
            {authMode === 'sign_up' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5 overflow-hidden"
              >
                <label className="text-slate-600 font-bold text-xs uppercase tracking-wider mt-1.5">
                  Confirm Password
                </label>
                <input 
                  type="password" 
                  required={authMode === 'sign_up'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl mt-4 hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Processing...' : (authMode === 'sign_in' ? 'Log In' : 'Create Account')}
          </button>
        </form>

        {/* --- THE GUEST ESCAPE HATCH --- */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
          <button 
            onClick={() => router.push('/checkout')}
            className="text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors"
          >
            Continue as Guest
          </button>
        </div>

      </motion.div>
    </div>
  );
}