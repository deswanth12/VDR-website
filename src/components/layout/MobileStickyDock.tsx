// src/components/layout/MobileStickyDock.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle } from 'lucide-react';
import { VDR_BUSINESS_INFO, generateGeneralWhatsAppLink } from '@/data/catalogue';

export default function MobileStickyDock() {
  const pathname = usePathname();

  // Hide global dock on individual product pages where ProductMobileBar handles model-specific conversion
  if (pathname && pathname.startsWith('/products/') && pathname.split('/').filter(Boolean).length >= 2) {
    return null;
  }

  return (
    <aside
      aria-label="Quick contact actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] px-3 py-2 shadow-lg"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Left: Call Showroom (35% width, min 48px height) */}
        <a
          href={VDR_BUSINESS_INFO.phoneCall}
          className="flex-1 basis-1/3 h-12 rounded-lg bg-[#0A3960] hover:bg-[#072A47] text-white flex items-center justify-center gap-1.5 text-xs font-semibold shadow-xs transition-colors"
          aria-label="Call Ravulapalem Showroom"
        >
          <Phone className="h-4 w-4 text-[#0284C7]" />
          <span>Call Desk</span>
        </a>

        {/* Right: WhatsApp Enquiry (65% width, min 48px height) */}
        <a
          href={generateGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 basis-2/3 h-12 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white flex items-center justify-center gap-2 text-xs font-bold shadow-xs transition-colors"
          aria-label="Enquire on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp Enquiry</span>
        </a>
      </div>
    </aside>
  );
}
