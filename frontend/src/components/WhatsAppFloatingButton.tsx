import React from 'react';
import { MessageCircle } from 'lucide-react';
import { DISPLAY_PHONE, getWhatsAppUrl } from '../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-40 group">
      <a
        href={getWhatsAppUrl('Hello Ponivraa Farm, I am looking to order fresh organic produce.')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Order via WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-white" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          Order on WhatsApp
        </span>
      </a>

      {/* Hover tooltip for desktop */}
      <div className="absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-[#1F2937] text-white text-[11px] font-semibold py-1 px-2.5 rounded shadow-lg whitespace-nowrap border border-gray-700">
          Direct Farm Help: {DISPLAY_PHONE}
        </div>
      </div>
    </aside>
  );
};

