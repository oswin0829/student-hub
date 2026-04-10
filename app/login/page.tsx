"use client";

import { useState, useEffect } from 'react'; // 1. Added useEffect
import { useRouter } from 'next/navigation'; // 2. Added useRouter
import Image from 'next/image';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js'; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type AuthMode = 'sign_in' | 'sign_up' | 'forgotten_password';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('sign_in');
  const router = useRouter(); // 3. Initialize the router

  // 4. THE MAGIC LISTENER: Watch for login success and redirect
    useEffect(() => {
    // 1. Check if they are ALREADY logged in when the page loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/checkout');
      }
    });

    // 2. Listen for NEW logins/signups
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // INITIAL_SESSION catches the state immediately after the component mounts
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session) {
          router.push('/checkout');
          router.refresh();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl border border-gray-100">
        
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-4 transition-transform duration-500 hover:rotate-12">
            <Image 
              src="/logo.png" 
              alt="MegaHelper Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">MĒGA HELPER</h1>
        </div>

        {/* The Segmented Toggle */}
        {authMode !== 'forgotten_password' && (
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8">
            <button
              onClick={() => setAuthMode('sign_in')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                authMode === 'sign_in' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('sign_up')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                authMode === 'sign_up' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {authMode === 'forgotten_password' && (
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-slate-800">Reset Password</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your email to receive a secure reset link.</p>
          </div>
        )}

        {/* Supabase Form Engine */}
        <div className="auth-container">
          <Auth
            supabaseClient={supabase}
            view={authMode} 
            showLinks={false} 
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb', 
                    brandAccent: '#1d4ed8', 
                  },
                },
              },
              className: {
                button: 'font-bold rounded-xl shadow-sm py-3 mt-2 transition-all active:scale-95',
                input: 'rounded-xl bg-gray-50 border-gray-200 py-3 focus:bg-white',
                label: 'text-slate-600 font-bold text-xs uppercase tracking-wider mb-1.5',
              }
            }}
            providers={[]} 
            // redirectTo is still here just in case you ever use password reset emails
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          />
        </div>
        
        {/* Custom Links */}
        {authMode === 'sign_in' && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => setAuthMode('forgotten_password')}
              className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        )}

        {authMode === 'forgotten_password' && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => setAuthMode('sign_in')}
              className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
}