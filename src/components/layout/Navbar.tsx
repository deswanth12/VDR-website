// src/components/layout/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Snowflake,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Menu,
  X,
  Wrench,
  Building,
  Scale,
  HelpCircle,
} from 'lucide-react';
import { VDR_BUSINESS_INFO, generateGeneralWhatsAppLink } from '@/data/catalogue';
import { useCompare } from '@/context/CompareContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { compareItems, isLoaded } = useCompare();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[var(--vdr-border)] shadow-xs">
      {/* 1. TOP UTILITY BAR (Deep Navy #0A3960) */}
      <div className="bg-[var(--vdr-navy)] text-[var(--vdr-ice)] px-3 sm:px-4 py-1.5 text-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
          {/* Location & Hours */}
          <div className="flex items-center gap-3 text-[10px] sm:text-xs min-w-0">
            <div className="flex items-center gap-1.5 font-medium truncate">
              <MapPin className="h-3.5 w-3.5 text-[var(--vdr-cyan)] shrink-0" />
              <span className="truncate">Ravulapalem, Konaseema Dist, AP</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300 shrink-0">
              <Clock className="h-3.5 w-3.5 text-[var(--vdr-cyan)] shrink-0" />
              <span>Mon – Sat: 8:30 AM – 8:30 PM (Tentative)</span>
            </div>
          </div>

          {/* Contact Fast Triggers */}
          <div className="flex items-center gap-2 shrink-0 text-[10px] sm:text-xs">
            <a
              href={generateGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white bg-[var(--vdr-status-success)] hover:bg-[#15803D] px-2.5 py-0.5 rounded-md font-semibold transition-colors text-[11px]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp Showroom</span>
            </a>
            <a
              href={VDR_BUSINESS_INFO.phoneCall}
              className="hidden sm:inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
              <span>Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo — actual VDR logo image */}
          <Link href="/" className="flex items-center shrink-0 group mr-2 sm:mr-4" aria-label="Vijaya Durga Refrigeration — Home">
            {/* Compact snowflake fallback for very small screens */}
            <div className="flex sm:hidden h-10 w-10 rounded-lg bg-[var(--vdr-navy)] items-center justify-center text-white shadow-xs group-hover:bg-[var(--vdr-navy-hover)] transition-colors shrink-0">
              <Snowflake className="h-6 w-6 text-[var(--vdr-cyan)]" />
            </div>
            {/* Full logo image on sm+ screens */}
            <Image
              src="/logo.png"
              alt="Vijaya Durga Refrigeration — Sales and Services"
              width={180}
              height={54}
              priority
              className="hidden sm:block h-12 w-auto object-contain"
            />
          </Link>

          {/* Primary Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-[var(--vdr-text-primary)]">
            <Link
              href="/catalogue"
              className="hover:text-[var(--vdr-cyan)] transition-colors py-1.5"
            >
              Catalogue
            </Link>
            <Link
              href="/categories/split-ac"
              className="hover:text-[var(--vdr-cyan)] transition-colors py-1.5"
            >
              Air Conditioners
            </Link>
            <Link
              href="/categories/washing-machine"
              className="hover:text-[var(--vdr-cyan)] transition-colors py-1.5"
            >
              Washing Machines
            </Link>
            <Link
              href="/spares"
              className="hover:text-[var(--vdr-cyan)] transition-colors py-1.5 inline-flex items-center gap-1"
            >
              <Wrench className="h-3 w-3 text-[var(--vdr-cyan)]" />
              <span>Spares Counter</span>
            </Link>
            <Link
              href="/services"
              className="hover:text-[var(--vdr-cyan)] transition-colors py-1.5 inline-flex items-center gap-1"
            >
              <HelpCircle className="h-3 w-3 text-[var(--vdr-cyan)]" />
              <span>Services</span>
            </Link>
            <Link
              href="/showroom"
              className="hover:text-[var(--vdr-cyan)] transition-colors py-1.5 inline-flex items-center gap-1"
            >
              <Building className="h-3 w-3 text-[var(--vdr-cyan)]" />
              <span>Showroom</span>
            </Link>
            <Link
              href="/compare"
              className="hover:text-[var(--vdr-cyan)] transition-colors py-1.5 inline-flex items-center gap-1"
            >
              <Scale className="h-3 w-3 text-[var(--vdr-cyan)]" />
              <span className="tabular-nums" suppressHydrationWarning>Compare {isLoaded && compareItems.length > 0 ? `(${compareItems.length})` : ''}</span>
            </Link>
          </nav>

          {/* Primary Action Button */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <a
              href={generateGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 min-h-[44px] px-4 rounded-lg bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 text-[var(--vdr-cyan)]" />
              <span>Enquire Now</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-slate-100 text-[var(--vdr-navy)] hover:bg-slate-200 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-b border-[var(--vdr-border)] px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <Link
            href="/catalogue"
            onClick={() => setMobileOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-xs font-semibold text-[var(--vdr-text-primary)] hover:bg-slate-50"
          >
            Complete Product Catalogue
          </Link>
          <Link
            href="/categories/split-ac"
            onClick={() => setMobileOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-xs font-semibold text-[var(--vdr-text-primary)] hover:bg-slate-50"
          >
            Inverter Split Air Conditioners
          </Link>
          <Link
            href="/categories/washing-machine"
            onClick={() => setMobileOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-xs font-semibold text-[var(--vdr-text-primary)] hover:bg-slate-50"
          >
            Fully Automatic Washing Machines
          </Link>
          <Link
            href="/spares"
            onClick={() => setMobileOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-xs font-semibold text-[var(--vdr-text-primary)] hover:bg-slate-50"
          >
            AC Replacement Spare Parts Counter
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-xs font-semibold text-[var(--vdr-text-primary)] hover:bg-slate-50"
          >
            Customer Care & Repair Services
          </Link>
          <Link
            href="/showroom"
            onClick={() => setMobileOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-xs font-semibold text-[var(--vdr-text-primary)] hover:bg-slate-50"
          >
            Showroom Location & Virtual Visit
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-xs font-semibold text-[var(--vdr-text-primary)] hover:bg-slate-50 tabular-nums"
          >
            Product Comparison <span suppressHydrationWarning>{isLoaded && compareItems.length > 0 ? `(${compareItems.length})` : ''}</span>
          </Link>

          <div className="pt-3 border-t border-[var(--vdr-border)] flex flex-col gap-2">
            <a
              href={generateGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 min-h-[44px] w-full rounded-lg bg-[var(--vdr-status-success)] text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Showroom</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
