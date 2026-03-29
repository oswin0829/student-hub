"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-center" 
      toastOptions={{
        style: {
          zIndex: 99999, /* Forces it to the very front */
        },
      }}
    />
  );
}