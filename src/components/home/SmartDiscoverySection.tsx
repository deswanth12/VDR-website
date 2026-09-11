// src/components/home/SmartDiscoverySection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Snowflake, Wrench, Waves, Sparkles, ArrowRight } from 'lucide-react';

export default function SmartDiscoverySection() {
  const categories = [
    {
      title: 'Inverter Air Conditioners',
      subtitle: '1.0T, 1.5T & 2.0T Capacity',
      description: 'High-efficiency 3-Star & 5-Star cooling systems engineered for coastal Andhra heat.',
      icon: Snowflake,
      href: '/catalogue?category=split-ac',
      count: 'Verified Models',
    },
    {
      title: 'Technician Spares Counter',
      subtitle: 'Compressors, Gas & Copper',
      description: 'Dedicated trade desk supplying genuine OEM cooling components to local mechanics.',
      icon: Wrench,
      href: '/spares',
      count: 'Trade Counter',
    },
    {
      title: 'Automatic Washing Machines',
      subtitle: 'Top Load & Front Load',
      description: 'Hygiene Steam care, digital inverter motors, and 5-Star BEE energy savings.',
      icon: Waves,
      href: '/catalogue?category=washing-machine',
      count: 'Home Laundry',
    },
    {
      title: 'Showroom Partner Brands',
      subtitle: 'Daikin, Lloyd, Mitsubishi, Samsung',
      description: 'Authorized manufacturer showcases with verified engineering specifications.',
      icon: Sparkles,
      href: '/brands/daikin',
      count: '4 Global Brands',
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-[var(--vdr-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--vdr-cyan)] uppercase tracking-wider mb-1">
              <span>Showroom Departments</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-[var(--vdr-text-secondary)] mt-0.5 max-w-2xl">
              Browse residential cooling, laundry appliances, and genuine replacement spare parts available at our Ravulapalem showroom.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-[var(--vdr-navy)] hover:text-[var(--vdr-cyan)] transition-colors self-start md:self-auto"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4-Pillar Clean Structured Grid (Zero card clutter, zero gradients) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={cat.href}
                className="group p-5 rounded-xl border border-[var(--vdr-border)] bg-white hover:border-[var(--vdr-cyan)] hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-[var(--vdr-ice)] flex items-center justify-center text-[var(--vdr-navy)] group-hover:bg-[var(--vdr-navy)] group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5 text-[var(--vdr-cyan)] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--vdr-text-muted)] uppercase tracking-wider">
                      {cat.count}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading group-hover:text-[var(--vdr-navy)] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-[var(--vdr-cyan)] mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[var(--vdr-text-secondary)] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--vdr-border)] flex items-center justify-between text-xs font-bold text-[var(--vdr-navy)] group-hover:text-[var(--vdr-cyan)] transition-colors">
                  <span>Explore Department</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
