// src/components/home/ServicesOverviewSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Wrench,
  Truck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/data/catalogue';

export default function ServicesOverviewSection() {
  const verifiedServices = [
    {
      title: 'In-Showroom AC Sizing & Consultation',
      desc: 'Expert guidance matching your room dimensions, floor level, and sunlight exposure to the appropriate cooling tonnage and energy star rating.',
      icon: HelpCircle,
      tag: 'Pre-Purchase Guidance',
    },
    {
      title: 'Technician Trade Counter & Spares Testing',
      desc: 'Dedicated counter for local AC repair mechanics and workshop contractors. Compressors, pure copper coils, and refrigerant cylinders checked prior to handover.',
      icon: Wrench,
      tag: 'Trade Support',
    },
    {
      title: 'Installation & Delivery Coordination',
      desc: 'Showroom assistance arranging delivery to your premises across Ravulapalem and coordinating standard installation setup per brand terms.',
      icon: Truck,
      tag: 'Logistics Assistance',
    },
    {
      title: 'Post-Purchase Warranty & Service Routing',
      desc: 'Help routing warranty service requests directly through the respective manufacturer service centers for Daikin, Lloyd, Mitsubishi, and Samsung.',
      icon: CheckCircle2,
      tag: 'Customer Support',
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 bg-white border-b border-[var(--vdr-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--vdr-cyan)] uppercase tracking-wider mb-1">
              <span>Verified Showroom Assistance</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
              Services & Customer Support at VDR
            </h2>
            <p className="text-xs sm:text-sm text-[var(--vdr-text-secondary)] mt-0.5 max-w-2xl">
              From sizing your air conditioner accurately to supplying genuine replacement parts for repair mechanics, our showroom provides direct local assistance.
            </p>
          </div>

          <Link
            href="/services"
            className="min-h-[44px] text-xs font-bold text-[var(--vdr-navy)] hover:text-[var(--vdr-cyan)] transition-colors inline-flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Learn More About Services</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4-Column Service Matrix (Clean 12px radius, no heavy card nesting) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {verifiedServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[var(--vdr-border)] bg-white p-5 space-y-3 flex flex-col justify-between hover:border-[var(--vdr-cyan)] hover:shadow-xs transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-lg bg-[var(--vdr-ice)] text-[var(--vdr-navy)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[var(--vdr-cyan)]" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {srv.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--vdr-text-primary)] leading-snug font-heading">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-[var(--vdr-text-secondary)] leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--vdr-border)]">
                  <a
                    href={generateGeneralWhatsAppLink(`Hi Vijaya Durga Refrigeration, I would like to enquire about your service: ${srv.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] flex items-center gap-1.5 text-xs font-bold text-[var(--vdr-status-success)] hover:text-[#15803D] transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
