/**
 * ARCHIVED: Login page with email verification flow.
 *
 * To re-enable:
 * 1. Copy this file back to app/login/page.tsx
 * 2. In Supabase Dashboard → Authentication → Email → Enable "Confirm email"
 * 3. (Optional) Set up custom SMTP via Resend to bypass rate limits:
 *    Host: smtp.resend.com | Port: 465 | Username: resend | Password: <RESEND_API_KEY>
 *
 * What this does differently from the current login page:
 * - After signup, instead of redirecting to '/', it shows a "Check your email" screen
 * - The user must click the confirmation link in their email before they can log in
 * - This prevents people from signing up with someone else's email address
 */

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
  const [emailSent, setEmailSent] = useState(false);
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
        // With email confirmation enabled in Supabase, no session is created yet.
        // Show a "check your email" screen instead of redirecting.
        setEmailSent(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black px-4 py-12">
      <motion.div 
        layout 
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="max-w-md w-full bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-4 transition-transform duration-500 hover:rotate-12">
            <Image src="/logo.png" alt="MegaHelper Logo" fill className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">MĒGA HELPER</h1>
        </div>

        {/* ── Email Confirmation Screen ── */}
        {emailSent ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Check your email</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
              We sent a confirmation link to
            </p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-6">{email}</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mb-8">
              Click the link in the email to activate your account. Check your spam folder if you don&apos;t see it.
            </p>
            <button
              onClick={() => {
                setEmailSent(false);
                setAuthMode('sign_in');
                setPassword('');
                setConfirmPassword('');
              }}
              className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95"
            >
              Back to Sign In
            </button>
          </motion.div>
        ) : (
          <>
            {/* The Segmented Toggle */}
            <div className="flex bg-slate-100 dark:bg-gray-800 p-1.5 rounded-xl mb-8">
              <button
                type="button"
                onClick={() => setAuthMode('sign_in')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                  authMode === 'sign_in' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                  authMode === 'sign_up' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-3 rounded-xl focus:outline-none focus:border-black dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-900 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-3 rounded-xl focus:outline-none focus:border-black dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-900 transition-colors"
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
                    <label className="text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider mt-1.5">
                      Confirm Password
                    </label>
                    <input 
                      type="password" 
                      required={authMode === 'sign_up'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-3 rounded-xl focus:outline-none focus:border-black dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-900 transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3.5 rounded-xl mt-4 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Processing...' : (authMode === 'sign_in' ? 'Log In' : 'Create Account')}
              </button>
            </form>

            {/* Guest escape hatch */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
              <button 
                onClick={() => router.push('/checkout')}
                className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </>
        )}

      </motion.div>
    </div>
  );
}
