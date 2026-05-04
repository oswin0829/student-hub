"use client";

import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl font-black tracking-tight mb-2">Refund Policy</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 mb-8 flex gap-4 items-start">
          <AlertCircle className="text-red-600 dark:text-red-500 shrink-0 mt-1" size={24} />
          <div>
            <h2 className="text-lg font-bold text-red-800 dark:text-red-400 mb-1">Strict No-Refund Policy</h2>
            <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
              Due to the nature of our digital products, all sales are considered final and non-refundable once the files have been delivered.
            </p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none space-y-6 text-slate-700 dark:text-slate-300">

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">1. Digital Goods</h2>
            <p>
              At MEGA HELPER ENTERPRISE, we provide premium digital assets, educational resources, and automation tools. Because our products are intangible goods that are delivered digitally and instantly, they cannot be "returned" like physical items.
            </p>
            <p>
              Therefore, we have a strict <strong>No-Refund Policy</strong>. By completing your purchase and downloading our products, you acknowledge and agree that you waive your right to a refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">2. Exceptions</h2>
            <p>
              We stand behind the quality of our tools. Refunds or replacements are solely at our discretion and will <em>only</em> be considered under the following highly specific circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>File Corruption:</strong> The delivered file is completely corrupted and our support team is unable to provide a working replacement within a reasonable timeframe.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">3. Technical Support</h2>
            <p>
              If you are experiencing technical difficulties downloading, accessing, or using your purchased digital tools, please do not file a dispute with your payment provider. Instead, contact our support team immediately. We are committed to helping you get your tools working as intended.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">4. Contact Information</h2>
            <p>
              For any issues regarding your purchase, please include your Order Transaction ID and contact us at:
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
