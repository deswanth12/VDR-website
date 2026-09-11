'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, ArrowLeft, MessageCircle } from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/data/catalogue';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log safe error telemetry without exposing secrets
    console.error('Unhandled runtime application error:', error.message);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-[var(--vdr-canvas)]">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="inline-flex h-14 w-14 rounded-xl bg-red-50 border border-red-200 items-center justify-center text-red-600 shadow-sm mx-auto">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vdr-text-secondary)] max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred while processing your request. Please try reloading the page or contact our showroom desk directly.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-[var(--vdr-border-strong)] text-[var(--vdr-text-primary)] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Homepage</span>
          </Link>

          <a
            href={generateGeneralWhatsAppLink('Hi Vijaya Durga Refrigeration, I encountered an issue on your website.')}
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
