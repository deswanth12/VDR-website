// src/components/home/HeroSection.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ArrowRight,
  MessageCircle,
  Snowflake,
  Waves,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import {
  generateGeneralWhatsAppLink,
} from '@/data/catalogue';

export default function HeroSection() {
  const [roomSize, setRoomSize] = useState<'small' | 'medium' | 'large'>('medium');

  const tonnageMap = {
    small: {
      label: 'Bedroom',
      area: 'Up to 110 sq.ft',
      tonnage: '1.0 Ton',
      note: 'Ideal for compact bedrooms and study rooms for low power consumption.',
    },
    medium: {
      label: 'Master Bed',
      area: '110 – 160 sq.ft',
      tonnage: '1.5 Ton',
      note: 'Most recommended for master bedrooms and standard living rooms in Konaseema.',
    },
    large: {
      label: 'Hall / Office',
      area: '160+ sq.ft',
      tonnage: '2.0 Ton',
      note: 'Best for open halls, top floors with direct sun exposure, or commercial spaces.',
    },
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-[var(--vdr-border)] pt-8 sm:pt-12 pb-10 sm:pb-14">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-radial-[at_top_right] from-[var(--vdr-ice)]/60 via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Core Showroom Value Proposition */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Showroom Location Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--vdr-ice)] border border-[#DCEAF5] px-3.5 py-1 text-xs font-semibold text-[var(--vdr-navy)] max-w-full">
              <MapPin className="h-3.5 w-3.5 text-[var(--vdr-cyan)] shrink-0" />
              <span className="truncate">Market Road, Ravulapalem, Konaseema Dist, AP</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[var(--vdr-text-primary)] tracking-tight leading-[1.2] font-heading">
              Air Conditioners, Home Appliances & Genuine AC Spares
            </h1>

            {/* Core Offerings Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-[var(--vdr-navy)]">
                <Snowflake className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                <span>Air Conditioners</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-[var(--vdr-navy)]">
                <Waves className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                <span>Washing Machines</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-[var(--vdr-navy)]">
                <Wrench className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                <span>Refrigeration Spares</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-[var(--vdr-navy)]">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                <span>Technician Spares Counter</span>
              </span>
            </div>

            {/* Descriptive Summary */}
            <p className="text-xs sm:text-sm text-[var(--vdr-text-secondary)] leading-relaxed max-w-xl">
              Vijaya Durga Refrigeration is your trusted showroom on Market Road, Ravulapalem. We help families select energy-efficient cooling solutions and washing machines with truthful capacity guidance, while operating a dedicated trade counter supplying genuine replacement parts to local HVAC technicians.
            </p>

            {/* Primary Action Buttons with 44px touch targets */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/catalogue"
                className="h-11 min-h-[44px] px-6 rounded-lg bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs sm:text-sm font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>Browse Products</span>
                <ArrowRight className="h-4 w-4 text-[var(--vdr-cyan)]" />
              </Link>

              <a
                href={generateGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 min-h-[44px] px-6 rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs sm:text-sm font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enquire on WhatsApp</span>
              </a>

              <Link
                href="/showroom"
                className="h-11 min-h-[44px] px-4 rounded-lg bg-white border border-[var(--vdr-border-strong)] hover:border-[var(--vdr-navy)] text-[var(--vdr-navy)] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                <span>Visit Showroom</span>
              </Link>
            </div>

            {/* Showroom Reality Strip */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-[var(--vdr-border)] text-xs text-[var(--vdr-text-primary)]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--vdr-cyan)] shrink-0" />
                <span className="font-medium">Ravulapalem Showroom</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--vdr-cyan)] shrink-0" />
                <span className="font-medium">Technician Spares Counter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--vdr-cyan)] shrink-0" />
                <span className="font-medium">Direct WhatsApp Enquiries</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quick AC Tonnage Guide Widget */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-[var(--vdr-border)] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--vdr-border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-[var(--vdr-ice)] flex items-center justify-center text-[var(--vdr-navy)]">
                    <Snowflake className="h-5 w-5 text-[var(--vdr-cyan)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--vdr-text-primary)] font-heading">
                      Quick AC Tonnage Guide
                    </h3>
                    <p className="text-[11px] text-[var(--vdr-text-secondary)]">
                      Select room area to find recommended capacity
                    </p>
                  </div>
                </div>
              </div>

              {/* Selector Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRoomSize(key)}
                    className={`min-h-[44px] py-2 px-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border text-center tabular-nums ${
                      roomSize === key
                        ? 'bg-[var(--vdr-navy)] text-white border-[var(--vdr-navy)] shadow-xs'
                        : 'bg-slate-50 text-[var(--vdr-text-secondary)] border-[var(--vdr-border)] hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">{tonnageMap[key].label}</div>
                    <div className="text-[10px] opacity-80">{tonnageMap[key].area}</div>
                  </button>
                ))}
              </div>

              {/* Recommendation Display */}
              <div className="rounded-lg bg-[var(--vdr-ice)] border border-[#DCEAF5] p-3.5 space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[var(--vdr-text-secondary)]">Recommended Capacity:</span>
                  <span className="text-base sm:text-lg font-extrabold text-[var(--vdr-navy)] font-heading tabular-nums">
                    {tonnageMap[roomSize].tonnage} Inverter AC
                  </span>
                </div>
                <p className="text-xs text-[var(--vdr-navy)] leading-snug">
                  {tonnageMap[roomSize].note}
                </p>
              </div>

              {/* Dynamic CTAs with 44px min height */}
              <div className="space-y-2 pt-1">
                <Link
                  href={`/catalogue?category=split-ac`}
                  className="min-h-[44px] flex items-center justify-center w-full py-2.5 rounded-lg bg-white border border-[var(--vdr-border-strong)] hover:border-[var(--vdr-navy)] text-[var(--vdr-navy)] text-xs font-semibold text-center transition-colors"
                >
                  View {tonnageMap[roomSize].tonnage} Models in Catalogue
                </Link>
                <a
                  href={generateGeneralWhatsAppLink(
                    `Hi Vijaya Durga Refrigeration, I am interested in a ${tonnageMap[roomSize].tonnage} AC for my room (${tonnageMap[roomSize].area}). What models are available at your showroom?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] flex items-center justify-center w-full py-2.5 rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs font-bold transition-colors shadow-xs gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Enquire for this Room Size</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
