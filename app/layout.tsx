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

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "MegaHelper",
  description: "The ultimate hub for premium digital assets and automation tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} scroll-smooth`} suppressHydrationWarning>
      <body className={`
        ${plusJakartaSans.className} 
        antialiased 
        text-black dark:text-white
        bg-white dark:bg-black
        selection:bg-slate-200 selection:text-black dark:selection:bg-slate-800 dark:selection:text-white
      `}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Toaster position="top-center" richColors /> 
          
          <Navbar />

          {/* 2. Added Social Bubbles here. They are fixed, so placement in the DOM doesn't matter much */}
          <SocialBubbles /> 
          
          <div className="relative">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}