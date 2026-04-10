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
    icon: (
        <svg 
        viewBox="0 0 24 24" 
        className="w-5 h-5 fill-current" 
        xmlns="http://www.w3.org/2000/svg"
        >
        <path d="M19.5 9h-2.5v-.5c0-2.481-2.019-4.5-4.5-4.5s-4.5 2.019-4.5 4.5v.5h-2.5c-1.379 0-2.5 1.121-2.5 2.5v7.5c0 2.206 1.794 4 4 4h11c2.206 0 4-1.794 4-4v-7.5c0-1.379-1.121-2.5-2.5-2.5zm-8.5-4c1.378 0 2.5 1.122 2.5 2.5v.5h-5v-.5c0-1.378 1.122-2.5 2.5-2.5z"/>
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