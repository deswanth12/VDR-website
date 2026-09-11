// src/components/home/FinalCTASection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Phone,
  MapPin,
  ArrowRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { VDR_BUSINESS_INFO, generateGeneralWhatsAppLink } from '@/data/catalogue';

export default function FinalCTASection() {
  return (
    <section className="py-14 sm:py-20 bg-[var(--vdr-navy)] text-white relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Callout */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#072A47] border border-[var(--vdr-cyan)]/40 px-3.5 py-1 text-xs font-bold text-[var(--vdr-cyan)]">
              <span>Direct Customer Assistance</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight font-heading leading-tight text-white">
              Looking for a Specific Model or Spare Part? Talk to VDR.
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              Connect directly with our showroom team on Market Road, Ravulapalem. We will verify current inventory, confirm model specifications, and provide accurate showroom pricing on WhatsApp or over a quick phone call.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={generateGeneralWhatsAppLink('Hi Vijaya Durga Refrigeration, I am looking for a product and would like to speak with your showroom desk.')}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-6 py-3 rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs sm:text-sm font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={VDR_BUSINESS_INFO.phoneCall}
                className="min-h-[44px] px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-white/20"
              >
                <Phone className="h-4 w-4 text-[var(--vdr-cyan)]" />
                <span>Call Showroom Helpline</span>
              </a>

              <Link
                href="/showroom"
                className="min-h-[44px] px-5 py-3 rounded-lg bg-transparent hover:bg-white/10 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Showroom Location</span>
                <ArrowRight className="h-4 w-4 text-[var(--vdr-cyan)]" />
              </Link>
            </div>
          </div>

          {/* Right Summary Card (Clean 12px radius) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#072A47] border border-[var(--vdr-cyan)]/30 p-6 space-y-4 shadow-md">
              <h3 className="text-base font-bold text-white font-heading border-b border-white/10 pb-3">
                Vijaya Durga Refrigeration
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                  <span>
                    Market Road, Opposite Pothamsetty Rammi Reddy Park Main Gate, Ravulapalem, Andhra Pradesh 533238
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Mon – Sat: 8:30 AM – 8:30 PM</span>
                    <p className="text-[10px] text-slate-400">Tentative — Subject to client confirmation</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={VDR_BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] w-full py-2.5 rounded-lg bg-[var(--vdr-cyan)] hover:bg-[#0275B1] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
