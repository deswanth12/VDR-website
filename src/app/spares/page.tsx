// src/app/spares/page.tsx
import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Wrench,
  Layers,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_PRODUCTS, VDR_BUSINESS_INFO, generateGeneralWhatsAppLink } from '@/data/catalogue';
import ProductCard from '@/components/products/ProductCard';

export const metadata = {
  title: 'AC Spare Parts & Technician Trade Counter | Vijaya Durga Refrigeration Ravulapalem',
  description:
    'Dedicated HVAC trade counter for AC repair mechanics and refrigeration technicians in Ravulapalem, Dr. B. R. Ambedkar Konaseema District. Compressors, pure copper coils, refrigerant gases, and inverter PCB kits.',
};

export default function SparesTradePage() {
  const sparesProducts = DEMO_PRODUCTS.filter((p) => p.category === 'ac-spares');

  const tradeCategories = [
    {
      title: 'Rotary & Reciprocating Compressors',
      desc: 'Hermetic rotary units for 1.0T, 1.5T, and 2.0T residential and commercial split air conditioners. R32 and R410A compatibility.',
      specs: ['1.0 Ton / 1.5 Ton / 2.0 Ton', 'Single-Phase 220V–240V', 'Overload Protection'],
    },
    {
      title: 'Pure Copper Refrigeration Tubing Coils',
      desc: 'Deoxidized high-phosphorus seamless copper tubing for suction and discharge line installations. High burst pressure resistance.',
      specs: ['1/4", 3/8", 1/2", 5/8" OD Sizes', 'Pancake Bundles & Roll Forms', 'HVAC Grade Specification'],
    },
    {
      title: 'Virgin Refrigerant Gas Cylinders',
      desc: 'High purity (>= 99.8%) virgin refrigerant cylinders and portable cans for air conditioning recharging and gas top-up servicing.',
      specs: ['R-32 Eco Refrigerant', 'R-410A Inverter Blend', 'Factory Sealed Disposable & Refillable'],
    },
    {
      title: 'Universal Inverter PCB Boards & Kits',
      desc: 'Universal motherboard kits complete with digital display, wireless remote controller, and dual temperature sensor probes for inverter servicing.',
      specs: ['Multi-Brand AC Compatibility', '180V–260V Working Range', 'Indoor & Outdoor Motor Control'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[var(--vdr-text-secondary)]">
          <Link
            href="/catalogue"
            className="min-h-[44px] inline-flex items-center gap-1 hover:text-[var(--vdr-navy)] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Catalogue</span>
          </Link>
          <span>/</span>
          <span className="text-[var(--vdr-text-primary)] font-semibold">AC Spare Parts & Trade Desk</span>
        </div>

        {/* Hero Banner for Trade Counter (Clean 12px radius) */}
        <div className="rounded-xl bg-[var(--vdr-navy)] text-white p-6 sm:p-10 lg:p-12 overflow-hidden relative shadow-md">
          <div className="relative space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#072A47] border border-[var(--vdr-cyan)]/40 px-3.5 py-1 text-xs font-bold text-[var(--vdr-cyan)]">
              <Wrench className="h-3.5 w-3.5" />
              <span>Dedicated Trade Counter for HVAC Mechanics & Technicians</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading">
              AC Spare Parts & Refrigeration Supplies in Ravulapalem
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Vijaya Durga Refrigeration operates an authorized trade desk on Market Road, Ravulapalem. We supply independent AC repair technicians, workshop contractors, and installation mechanics across Dr. B. R. Ambedkar Konaseema District with genuine replacement parts and refrigeration accessories.
            </p>

            {/* Quick Actions with 44px min height */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={generateGeneralWhatsAppLink(
                  'Hi Vijaya Durga Refrigeration, I am an AC repair technician looking for spare parts availability and trade counter pricing in Ravulapalem.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-6 py-3 rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs sm:text-sm font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enquire at Spares Trade Desk</span>
              </a>

              <a
                href={VDR_BUSINESS_INFO.phoneCall}
                className="min-h-[44px] px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-white/20"
              >
                <Phone className="h-4 w-4 text-[var(--vdr-cyan)]" />
                <span>Call Counter Helpline</span>
              </a>
            </div>
          </div>
        </div>

        {/* Counter Info Strip (Clean 12px radius) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-[var(--vdr-border)] p-4 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--vdr-navy)] font-heading">
              <MapPin className="h-4 w-4 text-[var(--vdr-cyan)]" />
              <span>Counter Location</span>
            </div>
            <p className="text-xs text-[var(--vdr-text-secondary)]">
              Market Road, Opposite Pothamsetty Rammi Reddy Park Main Gate, Ravulapalem
            </p>
          </div>

          <div className="rounded-xl bg-white border border-[var(--vdr-border)] p-4 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--vdr-navy)] font-heading">
              <Clock className="h-4 w-4 text-[var(--vdr-cyan)]" />
              <span>Counter Timings</span>
            </div>
            <p className="text-xs text-[var(--vdr-text-secondary)]">
              Mon – Sat: 8:30 AM – 8:30 PM (Subject to client confirmation)
            </p>
          </div>

          <div className="rounded-xl bg-white border border-[var(--vdr-border)] p-4 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--vdr-navy)] font-heading">
              <ShieldCheck className="h-4 w-4 text-[var(--vdr-cyan)]" />
              <span>Verification Policy</span>
            </div>
            <p className="text-xs text-[var(--vdr-text-secondary)]">
              All spare parts inspected and tested at the counter prior to handover.
            </p>
          </div>
        </div>

        {/* Trade Categories Grid */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading border-b border-[var(--vdr-border)] pb-3">
            Key Spare Parts Categories Handled
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tradeCategories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white border border-[var(--vdr-border)] p-5 space-y-3 shadow-xs hover:border-[var(--vdr-cyan)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[var(--vdr-ice)] flex items-center justify-center text-[var(--vdr-navy)]">
                    <Layers className="h-4 w-4 text-[var(--vdr-cyan)]" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
                    {cat.title}
                  </h3>
                </div>

                <p className="text-xs text-[var(--vdr-text-secondary)] leading-relaxed">
                  {cat.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.specs.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-slate-50 border border-[var(--vdr-border)] text-[11px] font-medium text-slate-700 px-2.5 py-0.5 rounded-md tabular-nums"
                    >
                      <CheckCircle2 className="h-3 w-3 text-[var(--vdr-status-success)]" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spares Catalogue Grid */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-[var(--vdr-border)] pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
              Current Spares Catalogue ({sparesProducts.length} Demo Items)
            </h2>
            <Link
              href="/catalogue"
              className="min-h-[44px] inline-flex items-center text-xs font-semibold text-[var(--vdr-cyan)] hover:underline"
            >
              View Full Showroom Catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sparesProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
