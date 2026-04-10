"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
// 1. Swapped to the standard core client
import { createClient } from '@supabase/supabase-js'; 

// 2. Initialize the client securely using your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">MĒGA HELPER</h1>
          <p className="text-slate-500 font-medium mt-1">Sign in to access your digital assets</p>
        </div>

        {/* 3. Pass the standard client into the Auth UI */}
        <Auth
          supabaseClient={supabase}
          view="magic_link" 
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb', // Matches tailwind blue-600
                  brandAccent: '#1d4ed8', // Matches tailwind blue-700
                },
              },
            },
            className: {
              button: 'font-bold rounded-xl shadow-sm',
              input: 'rounded-xl bg-gray-50 border-gray-200',
            }
          }}
          providers={['google']} 
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
        />
        
      </div>
    </div>
  );
}