"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-black tracking-tight mb-2">Terms of Service</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">1. Agreement to Terms</h2>
            <p>
              By accessing our website and purchasing our digital products, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">2. Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the Site and all digital products available for purchase are our proprietary property. When you purchase a digital product, you are granted a limited, non-exclusive, non-transferable license to use the product for your personal or internal business purposes.
            </p>
            <p className="mt-2 font-semibold">You may not:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Resell, redistribute, or share the digital files with others.</li>
              <li>Claim the digital products as your own creation.</li>
              <li>Use the digital products for illegal or unauthorized purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">3. Digital Product Delivery</h2>
            <p>
              Due to the nature of digital goods, your products will be delivered electronically via email immediately upon successful payment verification. It is your responsibility to provide a correct and accessible email address during checkout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">4. Modifications and Interruptions</h2>
            <p>
              We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the digital products without notice at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">5. Limitation of Liability</h2>
            <p>
              In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of the site or the digital products purchased.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">6. Governing Law</h2>
            <p>
              These Terms shall be governed by and defined following the laws of Malaysia. MEGA HELPER ENTERPRISE and yourself irrevocably consent that the courts of Malaysia shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">7. Contact Information</h2>
            <p>
              For any questions regarding these terms, please contact us at:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl mt-4 border border-slate-100 dark:border-slate-800">
              <p className="font-bold">MEGA HELPER ENTERPRISE (202503100347)</p>
              <p>Email: <a href="mailto:megastore0615@gmail.com" className="text-primary hover:underline">megastore0615@gmail.com</a></p>
              <p>Phone: <a href="tel:+60108260798" className="text-primary hover:underline">+60108260798</a></p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
