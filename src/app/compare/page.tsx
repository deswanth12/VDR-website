// src/app/compare/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  ArrowLeft,
  X,
  Plus,
  MessageCircle,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { DEMO_PRODUCTS, generateWhatsAppLink } from '@/data/catalogue';

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const [selectModalOpen, setSelectModalOpen] = useState(false);

  // 1-Click Preset Comparisons for quick discovery
  const loadPreset = (slugs: string[]) => {
    clearCompare();
    slugs.forEach((slug) => {
      const prod = DEMO_PRODUCTS.find((p) => p.slug === slug);
      if (prod) addToCompare(prod);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 pb-24 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/catalogue"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs text-[var(--vdr-text-secondary)] hover:text-[var(--vdr-navy)] font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Catalogue</span>
          </Link>

          {compareItems.length > 0 && (
            <button
              onClick={clearCompare}
              className="min-h-[44px] text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer px-2"
            >
              Clear Comparison ({compareItems.length})
            </button>
          )}
        </div>

        {/* Page Header */}
        <div className="space-y-1 border-b border-[var(--vdr-border)] pb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--vdr-cyan)] uppercase tracking-wider mb-1">
            <Scale className="h-4 w-4" />
            <span>Side-by-Side Model Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vdr-text-primary)] tracking-tight font-heading">
            Compare Appliance Specifications
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vdr-text-secondary)] max-w-2xl">
            Evaluate cooling capacity, BEE star ratings, compressor tech, and copper heat exchangers across models to make informed purchase decisions.
          </p>
        </div>

        {/* EMPTY STATE with 1-Click Comparison Presets */}
        {compareItems.length === 0 ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-dashed border-[var(--vdr-border-strong)] bg-white p-8 sm:p-12 text-center space-y-5 shadow-2xs">
              <div className="mx-auto h-12 w-12 rounded-full bg-[var(--vdr-ice)] flex items-center justify-center text-[var(--vdr-cyan)]">
                <Scale className="h-6 w-6" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-bold text-base text-[var(--vdr-text-primary)] font-heading">
                  No Models Currently Selected
                </h3>
                <p className="text-xs text-[var(--vdr-text-secondary)]">
                  Select up to 3 air conditioners or appliances from our catalogue to inspect technical differences, or launch a recommended comparison below:
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/catalogue"
                  className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[var(--vdr-navy)] text-white text-xs font-bold hover:bg-[var(--vdr-navy-hover)] transition-colors shadow-xs inline-flex items-center gap-2"
                >
                  <span>Browse Product Catalogue</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                </Link>
                <button
                  onClick={() => setSelectModalOpen(true)}
                  className="min-h-[44px] px-5 py-2.5 rounded-lg bg-slate-100 border border-[var(--vdr-border)] text-[var(--vdr-text-primary)] text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Pick from All Models
                </button>
              </div>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[var(--vdr-text-secondary)] uppercase tracking-wider">
                Popular Showroom Comparison Presets:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() =>
                    loadPreset([
                      'daikin-1-5-ton-5-star-inverter-split-ac',
                      'mitsubishi-electric-1-5-ton-heavy-inverter-ac',
                    ])
                  }
                  className="p-4 rounded-xl border border-[var(--vdr-border)] bg-white hover:border-[var(--vdr-cyan)] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-[var(--vdr-navy)] group-hover:text-[var(--vdr-cyan)] transition-colors">
                      Daikin 1.5T 5★ vs Mitsubishi Electric 1.5T
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                  </div>
                  <p className="text-[11px] text-[var(--vdr-text-secondary)]">
                    Compare two 1.5-ton inverter air conditioners across ISEER energy ratings and cooling features.
                  </p>
                </div>

                <div
                  onClick={() =>
                    loadPreset([
                      'daikin-1-0-ton-3-star-inverter-ac',
                      'daikin-1-5-ton-5-star-inverter-split-ac',
                    ])
                  }
                  className="p-4 rounded-xl border border-[var(--vdr-border)] bg-white hover:border-[var(--vdr-cyan)] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-[var(--vdr-navy)] group-hover:text-[var(--vdr-cyan)] transition-colors">
                      Daikin 3-Star (1.0 Ton) vs 5-Star (1.5 Ton)
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                  </div>
                  <p className="text-[11px] text-[var(--vdr-text-secondary)]">
                    Examine bedroom vs master bedroom capacity, BEE star ratings, and energy savings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Status Bar */}
            <div className="flex items-center justify-between bg-white border border-[var(--vdr-border)] rounded-xl p-3.5 text-xs text-[var(--vdr-text-secondary)] shadow-2xs">
              <span>
                Comparing <strong className="text-[var(--vdr-text-primary)] tabular-nums">{compareItems.length}</strong> of 3 models.
              </span>
              {compareItems.length < 3 && (
                <button
                  onClick={() => setSelectModalOpen(true)}
                  className="min-h-[36px] inline-flex items-center gap-1 text-[var(--vdr-navy)] font-semibold hover:text-[var(--vdr-cyan)] cursor-pointer px-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add another model</span>
                </button>
              )}
            </div>

            {/* Comparison Matrix (Clean 12px container) */}
            <div className="bg-white rounded-xl border border-[var(--vdr-border)] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--vdr-border)] bg-white divide-x divide-slate-100">
                      <th className="p-4 w-1/4 min-w-[180px] bg-slate-50/70 align-top">
                        <span className="text-[10px] font-bold text-[var(--vdr-text-muted)] uppercase tracking-wider block mb-1">
                          Appliance
                        </span>
                        <h2 className="font-bold text-sm text-[var(--vdr-text-primary)] font-heading">
                          Model Comparison
                        </h2>
                      </th>

                      {compareItems.map((product) => (
                        <th
                          key={product.id}
                          className="p-4 w-1/4 min-w-[220px] align-top bg-white relative"
                        >
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute top-3 right-3 h-6 w-6 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>

                          <div className="space-y-2 pr-7">
                            <div className="aspect-4/3 w-full bg-slate-50/50 rounded-lg p-2 border border-slate-100 flex items-center justify-center overflow-hidden">
                              <img
                                src={product.primaryImage || product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-contain"
                              />
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-[var(--vdr-cyan)] uppercase tracking-wider block">
                                {product.brand}
                              </span>
                              <h3 className="font-bold text-xs text-[var(--vdr-text-primary)] leading-snug line-clamp-2">
                                {product.name}
                              </h3>
                              {product.model && (
                                <span className="text-[10px] text-[var(--vdr-text-muted)] font-mono block tabular-nums">
                                  {product.model}
                                </span>
                              )}
                            </div>

                            <a
                              href={generateWhatsAppLink(product)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="min-h-[44px] w-full py-2 rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>Enquire on WhatsApp</span>
                            </a>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Body Rows Grouped by Purchase Decisions */}
                  <tbody className="divide-y divide-slate-100 text-slate-700 tabular-nums">
                    {/* GROUP 1: SIZING & TECHNOLOGY */}
                    <tr className="bg-[var(--vdr-ice)]/40 font-bold text-[11px] text-[var(--vdr-navy)]">
                      <td colSpan={compareItems.length + 1} className="py-2 px-4 uppercase tracking-wider font-heading">
                        1. Capacity & Cooling Tech
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 font-semibold text-[var(--vdr-navy)] bg-slate-50/50">Capacity / Sizing</td>
                      {compareItems.map((p) => (
                        <td key={p.id} className="p-3.5 font-bold text-[var(--vdr-text-primary)]">
                          {p.tonnageOrCapacity || 'N/A'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-3.5 font-semibold text-[var(--vdr-navy)] bg-slate-50/50">Cooling / Inverter Tech</td>
                      {compareItems.map((p) => (
                        <td key={p.id} className="p-3.5">
                          {p.coolingType || (p.inverterTech ? 'Inverter Technology' : 'Standard')}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-3.5 font-semibold text-[var(--vdr-navy)] bg-slate-50/50">Recommended Room Area</td>
                      {compareItems.map((p) => (
                        <td key={p.id} className="p-3.5 font-medium">
                          {p.suitableFor || 'Inquire with showroom'}
                        </td>
                      ))}
                    </tr>

                    {/* GROUP 2: ENERGY SAVINGS (BEE) */}
                    <tr className="bg-[var(--vdr-ice)]/40 font-bold text-[11px] text-[var(--vdr-navy)]">
                      <td colSpan={compareItems.length + 1} className="py-2 px-4 uppercase tracking-wider font-heading">
                        2. Energy Efficiency & Savings
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 font-semibold text-[var(--vdr-navy)] bg-slate-50/50">BEE Star Rating</td>
                      {compareItems.map((p) => (
                        <td key={p.id} className="p-3.5">
                          {p.starRating ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              <span>{p.starRating} Star BEE</span>
                            </span>
                          ) : (
                            'Not Rated'
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-3.5 font-semibold text-[var(--vdr-navy)] bg-slate-50/50">ISEER Efficiency Rating</td>
                      {compareItems.map((p) => (
                        <td key={p.id} className="p-3.5 font-mono">
                          {p.iseer || 'Spec to be confirmed'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-3.5 font-semibold text-[var(--vdr-navy)] bg-slate-50/50">Annual Power Consumption</td>
                      {compareItems.map((p) => (
                        <td key={p.id} className="p-3.5 font-mono">
                          {p.powerConsumption || 'Refer BEE star label'}
                        </td>
                      ))}
                    </tr>

                    {/* GROUP 3: HARDWARE DURABILITY */}
                    <tr className="bg-[var(--vdr-ice)]/40 font-bold text-[11px] text-[var(--vdr-navy)]">
                      <td colSpan={compareItems.length + 1} className="py-2 px-4 uppercase tracking-wider font-heading">
                        3. Hardware & Durability
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 font-semibold text-[var(--vdr-navy)] bg-slate-50/50">Condenser Heat Exchanger</td>
                      {compareItems.map((p) => (
                        <td key={p.id} className="p-3.5 font-medium">
                          {p.coilMaterial || 'Standard / OEM'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-3.5 font-semibold text-[var(--vdr-navy)] bg-slate-50/50">Refrigerant Gas</td>
                      {compareItems.map((p) => (
                        <td key={p.id} className="p-3.5 font-mono">
                          {p.refrigerant || 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* GROUP 4: WARRANTY & AVAILABILITY */}
                    <tr className="bg-[var(--vdr-ice)]/40 font-bold text-[11px] text-[var(--vdr-navy)]">
                      <td colSpan={compareItems.length + 1} className="py-2 px-4 uppercase tracking-wider font-heading">
                        4. Warranty & Showroom Support
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 font-semibold text-[var(--vdr-navy)] bg-slate-50/50">Manufacturer Warranty</td>
                      {compareItems.map((p) => (
                        <td key={p.id} className="p-3.5 text-[11px] text-slate-600">
                          {p.warranty || 'Inquire at showroom'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-3.5 font-semibold text-[var(--vdr-navy)] bg-slate-50/50">Showroom Stock & Pricing</td>
                      {compareItems.map((p) => (
                        <td key={p.id} className="p-3.5">
                          <span className="inline-flex items-center gap-1.5 text-[var(--vdr-status-success)] font-semibold text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>WhatsApp for Quote</span>
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Picking Additional Models */}
        {selectModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-[var(--vdr-border)] max-w-lg w-full max-h-[85vh] flex flex-col shadow-xl animate-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-[var(--vdr-border)] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--vdr-text-primary)] font-heading">
                  Select a Model to Compare
                </h3>
                <button
                  onClick={() => setSelectModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 space-y-2 divide-y divide-slate-100">
                {DEMO_PRODUCTS.map((prod) => {
                  const alreadySelected = compareItems.some((p) => p.id === prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="pt-2 first:pt-0 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                          <img
                            src={prod.primaryImage || prod.imageUrl}
                            alt={prod.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[var(--vdr-cyan)] uppercase block">
                            {prod.brand}
                          </span>
                          <h4 className="font-bold text-xs text-[var(--vdr-text-primary)] line-clamp-1">
                            {prod.name}
                          </h4>
                          <span className="text-[11px] text-[var(--vdr-text-secondary)] font-mono tabular-nums">
                            {prod.tonnageOrCapacity} • {prod.starRating ? `${prod.starRating}★ BEE` : prod.coolingType}
                          </span>
                        </div>
                      </div>

                      <button
                        disabled={alreadySelected}
                        onClick={() => {
                          addToCompare(prod);
                          setSelectModalOpen(false);
                        }}
                        className={`min-h-[44px] px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                          alreadySelected
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-[var(--vdr-navy)] text-white hover:bg-[var(--vdr-navy-hover)]'
                        }`}
                      >
                        {alreadySelected ? 'Selected' : 'Add Model'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
