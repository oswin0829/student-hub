import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/30 dark:bg-black/40 border-t border-black/5 dark:border-white/5 backdrop-blur-xl pt-16 pb-8 px-6 sm:px-8 lg:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">MegaHelper</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
            Premium digital assets, educational resources, and automation tools tailored for your success.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                Home / Store
              </Link>
            </li>
            <li>
              <Link href="/orders" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                Track My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Legal</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/privacy" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/refund" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Support</h4>
          <ul className="space-y-3">
            <li>
              <a href="mailto:megastore0615@gmail.com" className="group flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                <Mail size={16} className="group-hover:scale-110 transition-transform text-slate-400 group-hover:text-primary" />
                megastore0615@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+60108260798" className="group flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                <Phone size={16} className="group-hover:scale-110 transition-transform text-slate-400 group-hover:text-primary" />
                +60108260798
              </a>
            </li>
            <li className="pt-2">
              <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md">
                Usually responds within 24 hours
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} MEGA HELPER ENTERPRISE (202503100347). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
