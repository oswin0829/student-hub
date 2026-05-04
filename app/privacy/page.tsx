"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl font-black tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none space-y-6 text-slate-700 dark:text-slate-300">

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">1. Introduction</h2>
            <p>
              Welcome to MegaHelper Enterprise. We respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or purchase our digital tools and resources.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">2. Information We Collect</h2>
            <p>
              When you purchase a digital product from us, we collect the following information:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Contact Information:</strong> Your name and email address, used to deliver your digital goods and send purchase receipts.</li>
              <li><strong>Payment Information:</strong> We do not store your credit card or bank details. All payments are processed securely via third-party payment gateways (Billplz).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">3. How We Use Your Information</h2>
            <p>We use the information we collect primarily to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Fulfill and manage your purchases and orders.</li>
              <li>Send you your digital downloads and purchase receipts.</li>
              <li>Respond to your customer service inquiries and support requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">4. Sharing Your Information</h2>
            <p>
              We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-8">6. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl mt-4 border border-slate-100 dark:border-slate-800">
              <p className="font-bold">MEGA HELPER ENTERPRISE</p>
              <p>Email: <a href="mailto:megastore0615@gmail.com" className="text-primary hover:underline">megastore0615@gmail.com</a></p>
              <p>Phone: <a href="tel:+60108260798" className="text-primary hover:underline">+60108260798</a></p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
