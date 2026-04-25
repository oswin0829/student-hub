"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🚨 CHANGE THIS TO YOUR ACTUAL ADMIN EMAIL 🚨
const ALLOWED_ADMIN_EMAILS = ['oswincheong@gmail.com', 'chinleon.cl@gmail.com'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // 1. Not logged in at all? Go to login page.
        router.push('/login'); 
      } else if (!ALLOWED_ADMIN_EMAILS.includes(session.user.email || '')) {
        // 2. Logged in, but NOT an admin? Kick them to the storefront!
        toast.error("Access Denied: You do not have admin privileges.");
        router.push('/'); 
      } else {
        // 3. Logged in AND email matches? Welcome in, Boss.
        setIsAuthorized(true);
      }
    };

    checkUser();
  }, [router]);

  if (!isAuthorized) {
    return <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center font-bold text-slate-400 dark:text-slate-500">Verifying access...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      {children} 
    </div>
  );
}