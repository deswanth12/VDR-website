// src/components/products/ProductMobileBar.tsx
'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { ProductItem, generateWhatsAppLink, VDR_BUSINESS_INFO } from '@/data/catalogue';

interface ProductMobileBarProps {
  product: ProductItem;
}

export default function ProductMobileBar({ product }: ProductMobileBarProps) {
  return (
    <aside
      aria-label="Product mobile actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[var(--vdr-border)] px-4 py-2.5 shadow-lg flex items-center gap-3 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      {/* 35% Width: Call Desk */}
      <a
        href={VDR_BUSINESS_INFO.phoneCall}
        className="flex-1 basis-1/3 min-h-[44px] h-11 rounded-lg bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        aria-label="Call Ravulapalem Showroom Desk"
      >
        <Phone className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0" />
        <span className="whitespace-nowrap">Call Desk</span>
      </a>

      {/* 65% Width: WhatsApp Enquiry (Dominant Conversion CTA in Emerald) */}
      <a
        href={generateWhatsAppLink(product)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 basis-2/3 min-h-[44px] h-11 rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
        aria-label={`Enquire about ${product.name} on WhatsApp`}
      >
        <MessageCircle className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">WhatsApp Enquiry</span>
      </a>
    </aside>
  );
}
