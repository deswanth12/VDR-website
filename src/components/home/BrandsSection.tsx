// src/components/home/BrandsSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function BrandsSection() {
  const brands = [
    {
      name: 'Daikin',
      slug: 'daikin',
      category: 'Inverter Split ACs',
      feature: 'Patented Swing Inverter & PM 2.5 Filter',
      desc: 'High-efficiency cooling engineered with 100% grooved pure copper coils.',
    },
    {
      name: 'Lloyd',
      slug: 'lloyd',
      category: 'Rapid Cooling ACs',
      feature: 'Rapid 52°C Ambient Cooling & Golden Fin',
      desc: 'Engineered for high summer ambient temperatures with anti-corrosion protection.',
    },
    {
      name: 'Mitsubishi Electric',
      slug: 'mitsubishi-electric',
      category: 'Heavy Inverter Systems',
      feature: 'Tropical Compressors & Ultra-Quiet',
      desc: 'Precision heavy-duty cooling with dual-barrier dust filters and long air throw.',
    },
    {
      name: 'Samsung',
      slug: 'samsung',
      category: 'Washing Machines',
      feature: 'Digital Inverter & Hygiene Steam',
      desc: 'Fully automatic top-load and front-load laundry appliances with 5-Star BEE efficiency.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-[var(--vdr-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--vdr-cyan)] uppercase tracking-wider mb-1">
              <span>Manufacturer Partnerships</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
              Brands Available at Vijaya Durga Refrigeration
            </h2>
            <p className="text-xs sm:text-sm text-[var(--vdr-text-secondary)] mt-0.5 max-w-2xl">
              Explore models and specifications from leading air conditioning and appliance manufacturers available through our Ravulapalem showroom.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="min-h-[44px] text-xs font-bold text-[var(--vdr-navy)] hover:text-[var(--vdr-cyan)] transition-colors inline-flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>View All Catalogue Models</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Brand Showcase Grid (Clean 12px radius, zero heavy shadows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="group rounded-xl border border-[var(--vdr-border)] bg-white p-5 space-y-3 transition-all hover:border-[var(--vdr-cyan)] hover:shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-[var(--vdr-navy)] font-heading group-hover:text-[var(--vdr-cyan)] transition-colors">
                    {b.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {b.category}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[var(--vdr-cyan)]">
                  {b.feature}
                </p>

                <p className="text-xs text-[var(--vdr-text-secondary)] leading-relaxed">
                  {b.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--vdr-border)] flex items-center justify-between text-xs font-bold text-[var(--vdr-navy)] group-hover:text-[var(--vdr-cyan)]">
                <span>Browse {b.name} Models</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Factual Disclaimer Banner */}
        <div className="flex items-start gap-2.5 rounded-xl bg-white border border-[var(--vdr-border)] p-3.5 text-[11px] text-[var(--vdr-text-muted)]">
          <ShieldAlert className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[var(--vdr-text-secondary)]">Notice on Trademarks:</strong> Daikin, Lloyd, Mitsubishi Electric, and Samsung are registered trademarks of their respective manufacturers. Vijaya Durga Refrigeration is an independent local retail showroom and spares supplier in Ravulapalem.
          </p>
        </div>
      </div>
    </section>
  );
}
