import { Toaster } from 'sonner';
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // 1. Swapped to a premium geometric font
import "./globals.css";
import Navbar from "@/components/Navbar";

// 2. Configure Jakarta Sans with a variable for global CSS access
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: "MegaHelper",
  description: "The ultimate hub for premium digital assets and automation tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <body className={`
        ${plusJakartaSans.className} 
        antialiased 
        text-slate-900 
        bg-white 
        selection:bg-blue-100 selection:text-blue-900
      `}>
        {/* 3. The Toaster stays centered for that premium feedback feel */}
        <Toaster position="top-center" richColors /> 
        
        <Navbar />
        
        {/* Added a relative wrapper to ensure background glows in children don't overflow */}
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}