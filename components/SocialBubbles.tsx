"use client";

import { Instagram, MessageCircle, Send } from 'lucide-react';

export default function SocialBubbles() {
  // CONFIGURATION: Replace these with your customer's actual details
  const WHATSAPP_NUMBER = "60123456789"; 
  const IG_USERNAME = "megahelper.my";
  const SHOPEE_URL = "https://shopee.com.my/megahelper?entryPoint=ShopBySearch&searchKeyword=google%20form";

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={22} strokeWidth={2.5} />,
      color: "bg-[#25D366]",
      href: `https://wa.me/message/6NMCFKPIKHN3K1?text=Hi MegaHelper, I'm interested in your digital tools!`,
    },
    {
      name: "Telegram",
      icon: <Send size={20} strokeWidth={2.5} className="-translate-x-0.5 translate-y-0.5" />, // Tweak for paper plane "vibe"
      color: "bg-[#0088cc]",
      href: `https://t.me/+8TbJRH6JbZpiZGY1`,
    },
    {
      name: "Shopee",
      // Custom Shopee SVG for that authentic "S" logo
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.043 14.86c-.574-6.38-7.391-5.118-7.391-8.233 0-1.12.873-1.678 2.053-1.678 1.956 0 2.21 1.48 2.228 2.455h3.181c-.046-2.525-1.921-5.06-5.418-5.06-3.411 0-5.234 2.158-5.234 4.582 0 6.136 7.427 4.908 7.427 8.163 0 1.341-1.074 1.83-2.316 1.83-2.195 0-2.435-1.574-2.455-2.731H6.262c.032 2.695 1.955 5.462 5.642 5.462 3.864 0 5.626-2.224 5.626-4.793 0-.012 0-.012 0-.012h4.513v-.01zM1.957 19.333c.4 1.353 1.623 2.33 3.067 2.33h13.952c1.444 0 2.667-.977 3.067-2.33L24 10.333H0l1.957 9z"/>
        </svg>
      ),
      color: "bg-[#EE4D2D]",
      href: SHOPEE_URL,
    },
    {
      name: "Instagram",
      icon: <Instagram size={22} strokeWidth={2.5} />,
      color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
      href: `https://www.instagram.com/assignmenthelper.spss?igsh=MXg1YjRmcGllcGVvdw%3D%3D&utm_source=qr`,
    },
  ];

 return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            pointer-events-auto
            group flex items-center gap-3 p-3.5 rounded-full text-white shadow-2xl 
            transition-all duration-500 hover:scale-110 hover:-translate-x-2
            ${social.color}
          `}
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-black transition-all duration-500 group-hover:max-w-xs group-hover:px-2 uppercase tracking-widest">
            {social.name}
          </span>
          {social.icon}
        </a>
      ))}
    </div>
  );
}