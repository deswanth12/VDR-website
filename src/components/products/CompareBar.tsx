// src/components/products/CompareBar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useCompare } from '@/context/CompareContext';
import { ArrowRight, X, Scale } from 'lucide-react';

export default function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare, isLoaded } = useCompare();

  if (!isLoaded || compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-18 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-3xl animate-in slide-in-from-bottom-4 duration-200">
      <div className="rounded-xl bg-[var(--vdr-navy)] text-white p-3.5 sm:p-4 shadow-2xl border border-[var(--vdr-cyan)]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-[var(--vdr-navy-hover)] flex items-center justify-center text-[var(--vdr-cyan)] border border-[var(--vdr-cyan)]/30">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight font-heading tabular-nums">
                Compare ({compareItems.length}/3)
              </p>
              <p className="text-[10px] text-slate-300">
                Side-by-side specs
              </p>
            </div>
          </div>

          {/* Selected Product Chips */}
          <div className="flex items-center gap-2">
            {compareItems.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-1.5 bg-[var(--vdr-navy-hover)] border border-[var(--vdr-cyan)]/20 rounded-lg py-1 px-2 text-[11px]"
              >
                <img
                  src={product.primaryImage || product.imageUrl}
                  alt={product.name}
                  className="h-6 w-6 object-contain bg-white rounded p-0.5"
                />
                <span className="font-semibold text-slate-200 max-w-[90px] truncate">
                  {product.brand}
                </span>
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="text-slate-400 hover:text-white ml-0.5"
                  aria-label={`Remove ${product.name} from comparison`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Compare Button & Clear */}
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-300 hover:text-white px-2 py-1.5 transition-colors"
          >
            Clear
          </button>

          <Link
            href="/compare"
            className="touch-target px-4 py-2 rounded-lg bg-[var(--vdr-cyan)] hover:bg-[var(--vdr-cyan-hover)] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Compare Specifications</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
