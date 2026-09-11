// src/components/home/ShowroomInfo.tsx
'use client';

import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  Building,
  ExternalLink,
} from 'lucide-react';
import { VDR_BUSINESS_INFO, generateGeneralWhatsAppLink } from '@/data/catalogue';

export default function ShowroomInfo() {
  return (
    <section id="location" className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-[var(--vdr-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="max-w-2xl space-y-2 border-b border-[var(--vdr-border)] pb-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--vdr-cyan)] uppercase tracking-wider mb-1">
            <MapPin className="h-4 w-4" />
            <span>Showroom & Service Counter</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
            Visit Our Ravulapalem Showroom
          </h2>
          <p className="text-xs sm:text-sm text-[var(--vdr-text-secondary)] mt-0.5">
            We invite homeowners, commercial establishments, and AC mechanics across Dr. B. R. Ambedkar Konaseema District to visit our showroom and spares counter on Market Road, Ravulapalem.
          </p>
        </div>

        {/* Location & Details Grid (Clean 12px radius) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact and Hours Details */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-xl border border-[var(--vdr-border)] bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--vdr-border)]">
                <div className="h-10 w-10 rounded-lg bg-[var(--vdr-ice)] flex items-center justify-center text-[var(--vdr-navy)]">
                  <Building className="h-5 w-5 text-[var(--vdr-cyan)]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--vdr-text-primary)] font-heading">
                    {VDR_BUSINESS_INFO.name}
                  </h3>
                  <p className="text-xs text-[var(--vdr-text-secondary)]">
                    {VDR_BUSINESS_INFO.popularName}
                  </p>
                </div>
              </div>

              {/* Exact Address & Landmark */}
              <div className="flex items-start gap-3 text-xs text-[var(--vdr-text-secondary)]">
                <MapPin className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[var(--vdr-text-primary)] font-semibold mb-0.5">Showroom Address:</strong>
                  <span>{VDR_BUSINESS_INFO.street}</span>
                  <br />
                  <span className="text-[var(--vdr-navy)] font-semibold">Landmark: {VDR_BUSINESS_INFO.landmark}</span>
                  <br />
                  <span>{VDR_BUSINESS_INFO.town}, {VDR_BUSINESS_INFO.district} Dist.</span>
                  <br />
                  <span>{VDR_BUSINESS_INFO.state} - {VDR_BUSINESS_INFO.pincode}</span>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3 text-xs text-[var(--vdr-text-secondary)]">
                <Clock className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[var(--vdr-text-primary)] font-semibold mb-0.5">Showroom Timings:</strong>
                  <span>{VDR_BUSINESS_INFO.hours}</span>
                  <p className="text-[10px] text-amber-800 bg-amber-50 rounded px-1.5 py-0.5 mt-1 border border-amber-200/80 inline-block font-medium">
                    Tentative — Subject to explicit client confirmation
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 text-xs text-[var(--vdr-text-secondary)]">
                <Phone className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[var(--vdr-text-primary)] font-semibold mb-0.5">Phone & Inquiries:</strong>
                  <a href={VDR_BUSINESS_INFO.phoneCall} className="text-[var(--vdr-navy)] font-semibold hover:underline">
                    {VDR_BUSINESS_INFO.phoneDisplay}
                  </a>
                </div>
              </div>

              {/* Action Buttons with 44px min height */}
              <div className="pt-3 border-t border-[var(--vdr-border)] flex flex-col sm:flex-row gap-2.5">
                <a
                  href={generateGeneralWhatsAppLink('Hi Vijaya Durga Refrigeration, I am planning to visit your Ravulapalem showroom on Market Road.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[44px] rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Message on WhatsApp</span>
                </a>

                <a
                  href={VDR_BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 rounded-lg bg-[var(--vdr-ice)] hover:bg-[#DCEAF5] text-[var(--vdr-navy)] text-xs font-semibold border border-[#DCEAF5] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Navigation className="h-4 w-4 text-[var(--vdr-cyan)]" />
                  <span>Open in Maps</span>
                </a>
              </div>
            </div>

            {/* Verified Google Business Listing Link */}
            <div className="rounded-xl bg-white border border-[var(--vdr-border)] p-4 text-xs text-[var(--vdr-text-secondary)] leading-relaxed flex items-center justify-between gap-3 shadow-xs">
              <div>
                <strong className="text-[var(--vdr-text-primary)]">Verified Google Business:</strong> Located opposite Pothamsetty Rammi Reddy Park Main Gate, Market Road, Ravulapalem.
              </div>
              <a
                href={VDR_BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[36px] min-w-[36px] shrink-0 p-2 rounded-lg bg-slate-50 border border-[var(--vdr-border)] text-[var(--vdr-navy)] hover:text-[var(--vdr-cyan)] transition-colors flex items-center justify-center"
                title="View on Google Maps"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right: Embedded Interactive Map */}
          <div className="lg:col-span-7 h-[380px] sm:h-[420px] rounded-xl border border-[var(--vdr-border)] overflow-hidden shadow-xs relative bg-slate-100">
            <iframe
              title="Vijaya Durga Refrigeration Ravulapalem Location Map"
              src="https://maps.google.com/maps?q=Vijaya+Durga+Refrigeration,+Pothamsetti+Rammi+Reddy+park+Park+main+gate,+opposite+Ravulapalem,+Andhra+Pradesh+533238&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
