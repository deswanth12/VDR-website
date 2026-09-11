// src/components/products/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Clock,
  Scale,
  Check,
  Star,
  ArrowRight,
} from 'lucide-react';
import { ProductItem, generateWhatsAppLink } from '@/data/catalogue';
import { useCompare } from '@/context/CompareContext';
import ProductDetailModal from './ProductDetailModal';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const inCompare = isInCompare(product.id);

  const toggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white rounded-xl border border-[var(--vdr-border)] hover:border-[var(--vdr-border-strong)] hover:shadow-md transition-all duration-200 overflow-hidden group">
        {/* TOP BAR: Brand Badge & Compare Toggle */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 bg-white">
          <span className="rounded-md bg-[var(--vdr-navy)] text-white text-[11px] font-bold px-2.5 py-1 tracking-wide font-heading">
            {product.brand}
          </span>

          <button
            type="button"
            onClick={toggleCompare}
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              inCompare
                ? 'bg-[var(--vdr-ice)] border-[var(--vdr-cyan)] text-[var(--vdr-navy)]'
                : 'bg-slate-50 border-[var(--vdr-border)] text-slate-500 hover:border-slate-300 hover:text-[var(--vdr-navy)]'
            }`}
            title={inCompare ? 'Remove from comparison' : 'Add to side-by-side comparison'}
          >
            {inCompare ? (
              <>
                <Check className="h-3 w-3 text-[var(--vdr-cyan)]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Scale className="h-3 w-3 text-slate-400 group-hover:text-[var(--vdr-cyan)]" />
                <span>Compare</span>
              </>
            )}
          </button>
        </div>

        {/* PRODUCT IMAGE (4:3 aspect ratio with overlays) */}
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-4/3 w-full bg-slate-50/50 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100 cursor-pointer block"
        >
          <img
            src={product.primaryImage || product.imageUrl}
            alt={`${product.brand} ${product.name}`}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Demo Preview Tag (Distinguishable from verified data) */}
          {product.isDemo && (
            <span className="absolute top-2.5 left-2.5 text-[9px] font-semibold bg-amber-50/95 backdrop-blur-xs text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded shadow-2xs">
              Demo Preview
            </span>
          )}

          {/* Star Rating Badge (ACs) */}
          {product.starRating && (
            <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-white/95 backdrop-blur-xs text-[var(--vdr-text-primary)] border border-amber-200 px-2 py-0.5 rounded shadow-2xs flex items-center gap-1 tabular-nums">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{product.starRating}★ BEE</span>
            </span>
          )}
        </Link>

        {/* CARD BODY: Category, Name, Model, Key Specs */}
        <div className="flex flex-col flex-1 p-4 space-y-2">
          <span className="text-[10px] font-bold text-[var(--vdr-cyan)] uppercase tracking-wider block">
            {product.categoryName}
          </span>

          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-bold text-[var(--vdr-text-primary)] leading-snug group-hover:text-[var(--vdr-navy)] transition-colors font-heading line-clamp-2 min-h-[2.5rem]"
          >
            {product.name}
          </Link>

          {product.model && (
            <p className="text-[11px] text-[var(--vdr-text-secondary)] font-mono tabular-nums">
              Model: <span className="font-semibold text-slate-700">{product.model}</span>
            </p>
          )}

          {product.suitableFor && (
            <p className="text-[11px] text-[var(--vdr-text-secondary)] line-clamp-1">
              <strong className="text-slate-700">Fit:</strong> {product.suitableFor}
            </p>
          )}

          {/* KEY SPECIFICATIONS (Scannable, verified fields only) */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {product.keySpecs?.slice(0, 3).map((spec, i) => (
              <span
                key={i}
                className="inline-flex items-center text-[10px] bg-slate-50 border border-[var(--vdr-border)] px-2 py-0.5 rounded text-slate-700 tabular-nums"
              >
                <strong className="font-semibold text-[var(--vdr-navy)] mr-1">{spec.label}:</strong>
                <span>{spec.value}</span>
              </span>
            ))}
          </div>
        </div>

        {/* CARD FOOTER: Availability + Dominant WhatsApp CTA + Full Specs Link */}
        <div className="mt-auto p-4 pt-0 space-y-2.5">
          {/* Availability Status */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 rounded-md px-2.5 py-1.5 border border-[var(--vdr-border)]/70">
            <Clock className="h-3 w-3 text-[var(--vdr-cyan)] shrink-0" />
            <span className="truncate font-medium">Contact showroom for stock & price</span>
          </div>

          {/* WhatsApp Enquiry (Dominant Emerald #16A34A) with 44px touch target */}
          <a
            href={generateWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 min-h-[44px] rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            aria-label={`Enquire about ${product.brand} ${product.name} on WhatsApp`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Enquire on WhatsApp</span>
          </a>

          {/* View Full Specs Link */}
          <Link
            href={`/products/${product.slug}`}
            className="w-full py-1.5 text-xs font-semibold text-[var(--vdr-navy)] hover:text-[var(--vdr-cyan)] flex items-center justify-center gap-1 transition-colors"
          >
            <span>View Full Specifications</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal fallback */}
      {modalOpen && (
        <ProductDetailModal
          product={product}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
