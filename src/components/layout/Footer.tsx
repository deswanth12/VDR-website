// src/components/layout/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Snowflake,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Wrench,
  HelpCircle,
  Building,
} from 'lucide-react';
import {
  VDR_BUSINESS_INFO,
  generateGeneralWhatsAppLink,
} from '@/data/catalogue';

export default function Footer() {
  const brandLinks = [
    { name: 'Daikin', slug: 'daikin' },
    { name: 'Lloyd', slug: 'lloyd' },
    { name: 'Mitsubishi Electric', slug: 'mitsubishi-electric' },
    { name: 'Samsung', slug: 'samsung' },
    { name: 'Universal Spares', slug: 'universal-oem' },
  ];

  return (
    <footer className="bg-[var(--vdr-navy)] text-white border-t border-[var(--vdr-navy-hover)] pt-12 sm:pt-16 pb-20 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Col 1: Brand Anchor & Showroom Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[var(--vdr-navy-hover)] flex items-center justify-center border border-[var(--vdr-cyan)]/30">
                <Snowflake className="h-6 w-6 text-[var(--vdr-cyan)]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white tracking-tight font-heading">
                  Vijaya Durga Refrigeration
                </h3>
                <p className="text-xs text-slate-300">
                  Ravulapalem, Dr. B. R. Ambedkar Konaseema Dist, AP
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Air conditioner and home appliance sales, genuine AC replacement spare parts, and technical refrigeration support for residential and commercial customers in Ravulapalem, Konaseema, and the Godavari region.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={generateGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 min-h-[44px] inline-flex items-center justify-center gap-2 bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Contact via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Showroom Discovery & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--vdr-cyan)] font-heading">
              Showroom Discovery
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/catalogue" className="hover:text-white transition-colors">
                  Complete Product Catalogue
                </Link>
              </li>
              <li>
                <Link href="/categories/split-ac" className="hover:text-white transition-colors">
                  Inverter Split Air Conditioners
                </Link>
              </li>
              <li>
                <Link href="/categories/washing-machine" className="hover:text-white transition-colors">
                  Automatic Washing Machines
                </Link>
              </li>
              <li>
                <Link href="/spares" className="hover:text-white transition-colors flex items-center gap-1.5 font-medium text-slate-200">
                  <Wrench className="h-3 w-3 text-[var(--vdr-cyan)]" />
                  <span>Technician Spares Counter</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-200">
                  <HelpCircle className="h-3 w-3 text-[var(--vdr-cyan)]" />
                  <span>Services & Support</span>
                </Link>
              </li>
              <li>
                <Link href="/showroom" className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-200">
                  <Building className="h-3 w-3 text-[var(--vdr-cyan)]" />
                  <span>Visit Showroom</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Partner Brands */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--vdr-cyan)] font-heading">
              Authorized Brands
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {brandLinks.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{brand.name}</span>
                    <span className="text-[10px] text-slate-400">View Products →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Verified Showroom Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--vdr-cyan)] font-heading">
              Showroom Location
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                <address className="not-italic text-slate-300 leading-relaxed text-[11px]">
                  {VDR_BUSINESS_INFO.fullAddress}
                </address>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0" />
                <span className="text-[11px] tabular-nums">{VDR_BUSINESS_INFO.hours}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0" />
                <a
                  href={VDR_BUSINESS_INFO.phoneCall}
                  className="hover:text-white text-[11px] font-mono tabular-nums"
                >
                  {VDR_BUSINESS_INFO.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={VDR_BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--vdr-cyan)] hover:underline"
              >
                <span>Open in Google Maps →</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Vijaya Durga Refrigeration. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/admin" className="hover:text-slate-200 transition-colors">
              Admin Portal
            </Link>
            <Link href="/contact" className="hover:text-slate-200 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
