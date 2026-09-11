// src/components/home/SparesTradeSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  Cpu,
  Flame,
  Layers,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/data/catalogue';

export default function SparesTradeSection() {
  const sparesCategories = [
    {
      title: 'AC Compressors',
      desc: 'Rotary & inverter compressor units compatible with 1.0T, 1.5T, and 2.0T split systems.',
      icon: Cpu,
    },
    {
      title: 'Refrigerant Gases',
      desc: 'Virgin R-32 and R-410A refrigerant cylinders and disposable cans for AC gas charging.',
      icon: Flame,
    },
    {
      title: 'Pure Copper Piping',
      desc: 'Seamless HVAC-grade copper coils and pancake tubing (1/4", 3/8", 1/2" sizes).',
      icon: Layers,
    },
    {
      title: 'Inverter PCB Boards & Kits',
      desc: 'Universal control board kits, replacement PCB assemblies, remote units, and sensors.',
      icon: Wrench,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-[var(--vdr-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-xl bg-[var(--vdr-navy)] text-white p-6 sm:p-10 lg:p-12 overflow-hidden relative shadow-md">
          <div className="relative space-y-8">
            {/* Header */}
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#072A47] border border-[var(--vdr-cyan)]/30 px-3 py-1 text-xs font-semibold text-[var(--vdr-cyan)]">
                <Wrench className="h-3.5 w-3.5" />
                <span>Trade Counter for HVAC Technicians & Mechanics</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-heading">
                Genuine AC Spare Parts & Refrigeration Supplies
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Vijaya Durga Refrigeration operates a dedicated spare parts desk on Market Road, Ravulapalem. We support local AC repair mechanics, installation contractors, and workshop technicians across Dr. B. R. Ambedkar Konaseema district with authentic replacement parts and refrigeration accessories.
              </p>
            </div>

            {/* Spares Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sparesCategories.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-lg bg-[#072A47]/80 border border-white/10 p-5 space-y-3 hover:border-[var(--vdr-cyan)]/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-[var(--vdr-navy)] flex items-center justify-center border border-[var(--vdr-cyan)]/40 text-[var(--vdr-cyan)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Spares Trade CTA Bar */}
            <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white">Technician Trade Desk:</span> Contact our counter with your required part number, compressor capacity, or gas cylinder requirement.
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/catalogue?category=ac-spares"
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-[var(--vdr-navy)] text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span>View Spares Catalogue</span>
                  <ArrowRight className="h-4 w-4 text-[var(--vdr-cyan)]" />
                </Link>

                <a
                  href={generateGeneralWhatsAppLink(
                    'Hi Vijaya Durga Refrigeration, I am an AC technician / mechanic looking for spare parts availability in Ravulapalem (Konaseema Dist).'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Enquire for Spares on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
