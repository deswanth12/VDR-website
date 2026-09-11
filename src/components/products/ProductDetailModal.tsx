// src/components/products/ProductDetailModal.tsx
'use client';

import React, { useEffect } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  MapPin,
  ShieldAlert,
  Info,
  Star,
} from 'lucide-react';
import { ProductItem, generateWhatsAppLink, VDR_BUSINESS_INFO } from '@/data/catalogue';

interface ProductDetailModalProps {
  product: ProductItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Build clean showroom technical specification table containing ONLY existing fields
  const coreSpecRows: Array<{ label: string; value?: string | number }> = [
    { label: 'Brand', value: product.brand },
    { label: 'Model', value: product.model },
    { label: 'Category', value: product.categoryName },
    { label: 'Capacity', value: product.tonnageOrCapacity },
    { label: 'Energy Rating', value: product.starRating ? `${product.starRating} Star BEE` : undefined },
    { label: 'Cooling Type', value: product.coolingType },
    { label: 'Refrigerant', value: product.refrigerant },
    { label: 'ISEER', value: product.iseer },
    { label: 'Power Consumption', value: product.powerConsumption },
    { label: 'Coil Material', value: product.coilMaterial },
    // Additional specs from data that aren't already represented above
    ...(product.detailedSpecs || [])
      .filter(
        (s) =>
          !['Brand', 'Model Series', 'Model', 'Capacity', 'Energy Rating', 'Cooling Type', 'Refrigerant', 'ISEER', 'Power Consumption', 'Condenser Coil', 'Coil Material'].includes(s.label)
      )
      .map((s) => ({ label: s.label, value: s.value })),
    { label: 'Warranty', value: product.warranty },
    { label: 'Showroom Availability', value: product.availability },
  ];

  // Strictly filter out any undefined, null, or empty values
  const visibleSpecs = coreSpecRows.filter((r) => r.value !== undefined && r.value !== null && r.value !== '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-[#E2E8F0]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#0A3960] text-white text-xs font-bold px-2.5 py-1 tracking-wide font-heading">
              {product.brand}
            </span>
            {product.isDemo && (
              <span className="rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold px-2 py-0.5">
                Demo Preview
              </span>
            )}
            {product.starRating && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>{product.starRating} Star BEE</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Row: Image & Key Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            <div className="sm:col-span-5 bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-center aspect-4/3 sm:aspect-square overflow-hidden relative">
              <img
                src={product.primaryImage || product.imageUrl}
                alt={`${product.brand} ${product.name}`}
                className="max-h-full max-w-full object-contain"
              />
              {product.isDemo && (
                <span className="absolute bottom-2 right-2 text-[9px] font-semibold bg-white/90 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                  Demo Image
                </span>
              )}
            </div>

            <div className="sm:col-span-7 space-y-2.5">
              <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider block">
                {product.categoryName}
              </span>
              <h2
                id="modal-product-title"
                className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug font-heading"
              >
                {product.name}
              </h2>

              {product.model && (
                <p className="text-xs text-[#475569] font-mono">
                  Model: <span className="font-semibold text-slate-700">{product.model}</span>
                </p>
              )}

              <p className="text-xs text-[#475569] leading-relaxed">
                {product.description || product.shortSummary}
              </p>

              {product.suitableFor && (
                <div className="rounded-lg bg-[#EBF3FA] border border-[#DCEAF5] p-2.5 text-xs text-[#0A3960]">
                  <strong>Recommended Fit:</strong> {product.suitableFor}
                </div>
              )}

              <div className="pt-1 flex items-center gap-2 text-xs text-[#475569]">
                <MapPin className="h-4 w-4 text-[#0284C7] shrink-0" />
                <span>Showroom in Ravulapalem, Konaseema Dist, AP</span>
              </div>
            </div>
          </div>

          {/* Clean Technical Specifications Table (Strictly displaying only existing fields) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-heading">
                Technical Specifications
              </h3>
              <span className="text-[11px] text-slate-500">
                Showroom reference data
              </span>
            </div>

            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  {visibleSpecs.map((spec, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}
                    >
                      <td className="py-2.5 px-4 font-semibold text-[#0A3960] w-2/5 border-b border-slate-100">
                        {spec.label}
                      </td>
                      <td className="py-2.5 px-4 text-[#0F172A] border-b border-slate-100">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Factual Integrity & Warranty Disclaimers */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs text-[#475569]">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0F172A]">Stock & Pricing Notice:</strong>{' '}
                {product.showroomAvailabilityNote || product.availability}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0F172A]">Manufacturer Warranty:</strong>{' '}
                {product.warranty || product.warrantyDisclaimer}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions: Exclusive Emerald WhatsApp + Phone Direct */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-2.5">
          <a
            href={generateWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 touch-target rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Enquire on WhatsApp</span>
          </a>

          <a
            href={VDR_BUSINESS_INFO.phoneCall}
            className="touch-target px-5 rounded-lg bg-[#0A3960] hover:bg-[#072A47] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="h-4 w-4 text-[#0284C7]" />
            <span>Call Showroom</span>
          </a>
        </div>
      </div>
    </div>
  );
}
