import { Toaster } from 'sonner';
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SocialBubbles from "@/components/SocialBubbles"; // 1. Imported the new component

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
        <Toaster position="top-center" richColors /> 
        
        <Navbar />

        {/* 2. Added Social Bubbles here. They are fixed, so placement in the DOM doesn't matter much */}
        <SocialBubbles /> 
        
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}