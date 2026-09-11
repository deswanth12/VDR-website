// src/app/showroom/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Navigation,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { VDR_BUSINESS_INFO, generateGeneralWhatsAppLink } from '@/data/catalogue';

export const metadata: Metadata = {
  title: 'Showroom Location & Directions | Vijaya Durga Refrigeration Ravulapalem',
  description:
    'Visit Vijaya Durga Refrigeration showroom on Market Road, opposite Pothamsetty Rammi Reddy Park main gate, Ravulapalem, Andhra Pradesh. Google Maps directions, phone helpline, and WhatsApp contact.',
};

export default function ShowroomPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[var(--vdr-text-secondary)]">
          <Link
            href="/"
            className="min-h-[44px] inline-flex items-center gap-1 hover:text-[var(--vdr-navy)] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-[var(--vdr-text-primary)] font-semibold">Showroom & Location</span>
        </div>

        {/* Hero Section (Clean 12px radius) */}
        <div className="rounded-xl bg-[var(--vdr-navy)] text-white p-6 sm:p-10 relative overflow-hidden shadow-md">
          <div className="relative space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#072A47] border border-[var(--vdr-cyan)]/40 px-3.5 py-1 text-xs font-bold text-[var(--vdr-cyan)]">
              <Building className="h-3.5 w-3.5" />
              <span>Physical Retail Store & Trade Counter</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Visit Vijaya Durga Refrigeration in Ravulapalem
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              We welcome customers, builders, and HVAC mechanics to visit our showroom located centrally on Market Road, Ravulapalem. Inspect display air conditioners, automatic washing machines, and replacement spare parts in person.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={VDR_BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[var(--vdr-cyan)] hover:bg-[#0275B1] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Driving Directions</span>
              </a>

              <a
                href={generateGeneralWhatsAppLink('Hi Vijaya Durga Refrigeration, I am planning to visit your showroom in Ravulapalem.')}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message on WhatsApp</span>
              </a>

              <a
                href={VDR_BUSINESS_INFO.phoneCall}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-2 border border-white/20"
              >
                <Phone className="h-4 w-4 text-[var(--vdr-cyan)]" />
                <span>Call Showroom Helpline</span>
              </a>
            </div>
          </div>
        </div>

        {/* Address & Operational Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Exact Address & Landmark */}
          <div className="rounded-xl border border-[var(--vdr-border)] bg-white p-6 space-y-3 shadow-xs">
            <div className="h-9 w-9 rounded-lg bg-[var(--vdr-ice)] flex items-center justify-center text-[var(--vdr-navy)]">
              <MapPin className="h-5 w-5 text-[var(--vdr-cyan)]" />
            </div>
            <h3 className="text-base font-bold text-[var(--vdr-text-primary)] font-heading">
              Showroom Address
            </h3>
            <p className="text-xs text-[var(--vdr-text-secondary)] leading-relaxed">
              <strong>Vijaya Durga Refrigeration</strong><br />
              Market Road, Ravulapalem<br />
              Dr. B. R. Ambedkar Konaseema District<br />
              Andhra Pradesh — 533238
            </p>
            <div className="pt-2 text-xs font-semibold text-[var(--vdr-navy)] bg-[var(--vdr-ice)] p-2.5 rounded-lg">
              <strong>Landmark:</strong> Directly Opposite Pothamsetty Rammi Reddy Park Main Gate.
            </div>
          </div>

          {/* Card 2: Operating Hours */}
          <div className="rounded-xl border border-[var(--vdr-border)] bg-white p-6 space-y-3 shadow-xs">
            <div className="h-9 w-9 rounded-lg bg-[var(--vdr-ice)] flex items-center justify-center text-[var(--vdr-navy)]">
              <Clock className="h-5 w-5 text-[var(--vdr-cyan)]" />
            </div>
            <h3 className="text-base font-bold text-[var(--vdr-text-primary)] font-heading">
              Operating Schedule
            </h3>
            <div className="space-y-1.5 text-xs text-[var(--vdr-text-secondary)]">
              <p>
                <strong className="text-[var(--vdr-text-primary)]">Monday – Saturday:</strong><br />
                8:30 AM – 8:30 PM
              </p>
              <p>
                <strong className="text-[var(--vdr-text-primary)]">Sunday:</strong><br />
                Inquire via WhatsApp for Sunday timings
              </p>
            </div>
            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
              Notice: Hours based on directory estimates; subject to final client confirmation.
            </p>
          </div>

          {/* Card 3: What You'll Find */}
          <div className="rounded-xl border border-[var(--vdr-border)] bg-white p-6 space-y-3 shadow-xs">
            <div className="h-9 w-9 rounded-lg bg-[var(--vdr-ice)] flex items-center justify-center text-[var(--vdr-navy)]">
              <Building className="h-5 w-5 text-[var(--vdr-cyan)]" />
            </div>
            <h3 className="text-base font-bold text-[var(--vdr-text-primary)] font-heading">
              Showroom Facilities
            </h3>
            <ul className="space-y-2 text-xs text-[var(--vdr-text-secondary)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--vdr-status-success)] shrink-0" />
                <span>Display Split AC Models</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--vdr-status-success)] shrink-0" />
                <span>Automatic Washing Machines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--vdr-status-success)] shrink-0" />
                <span>HVAC Technician Spares Counter</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--vdr-status-success)] shrink-0" />
                <span>Capacity Sizing Consultation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Embedded Map Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--vdr-border)] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[var(--vdr-text-primary)] font-heading">
                Interactive Google Map Location
              </h2>
              <p className="text-xs text-[var(--vdr-text-secondary)]">
                Locate our physical storefront opposite Pothamsetty Rammi Reddy Park main gate on Market Road.
              </p>
            </div>

            <a
              href={VDR_BUSINESS_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--vdr-navy)] hover:text-[var(--vdr-cyan)] transition-colors"
            >
              <span>Open in Maps App</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="h-[420px] rounded-xl border border-[var(--vdr-border)] overflow-hidden shadow-xs relative bg-slate-100">
            <iframe
              title="Vijaya Durga Refrigeration Ravulapalem Map"
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
    </div>
  );
}
