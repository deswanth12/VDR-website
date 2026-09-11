import React from 'react';
import Link from 'next/link';
import { Snowflake, ArrowLeft, Search, MessageCircle } from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/data/catalogue';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-[var(--vdr-canvas)]">
      <div className="w-full max-w-lg text-center space-y-6">
        <div className="inline-flex h-16 w-16 rounded-xl bg-[var(--vdr-navy)] items-center justify-center text-white shadow-md mx-auto">
          <Snowflake className="h-9 w-9 text-[var(--vdr-cyan)]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--vdr-cyan)]">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--vdr-text-primary)] tracking-tight font-heading">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vdr-text-secondary)] max-w-md mx-auto leading-relaxed">
            The page or product you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/catalogue"
            className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-[var(--vdr-border-strong)] text-[var(--vdr-text-primary)] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Search className="h-4 w-4 text-[var(--vdr-cyan)]" />
            <span>Browse Catalogue</span>
          </Link>

          <a
            href={generateGeneralWhatsAppLink('Hi Vijaya Durga Refrigeration, I was looking for a page or product on your website that could not be found.')}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp Helpline</span>
          </a>
        </div>
      </div>
    </div>
  );
}
