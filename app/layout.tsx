import { Toaster } from 'sonner'; // 1. New import
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Student Hub Replica",
  description: "E-commerce platform for digital goods",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Drop the new Toaster in (richColors makes it green on success) */}
        <Toaster position="top-center" richColors /> 
        <Navbar />
        {children}
      </body>
    </html>
  );
}