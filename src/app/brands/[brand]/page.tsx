// src/app/brands/[brand]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageCircle, MapPin, ShieldAlert, Sparkles } from 'lucide-react';
import { DEMO_PRODUCTS, generateGeneralWhatsAppLink } from '@/data/catalogue';
import ProductCard from '@/components/products/ProductCard';

interface BrandConfig {
  name: string;
  slug: string;
  categoryTag: string;
  tagline: string;
  description: string;
  highlights: string[];
}

const BRAND_CONFIGS: Record<string, BrandConfig> = {
  daikin: {
    name: 'Daikin',
    slug: 'daikin',
    categoryTag: 'Air Conditioning Systems',
    tagline: 'High-Efficiency Inverter Air Conditioners with Grooved Copper Coils',
    description:
      'Daikin air conditioning solutions available through Vijaya Durga Refrigeration showroom in Ravulapalem. Engineered with patented swing inverter compressors, PM 2.5 air purification filters, and reliable cooling performance suited for Andhra Pradesh climates.',
    highlights: [
      'Patented Swing Inverter Compressor Technology',
      '100% Grooved Pure Copper Condenser & Evaporator Coils',
      'PM 2.5 Particulate Filter & Anti-Microbial Protection',
      'Stabilizer-Free Operation Capability Across Voltage Fluctuations',
    ],
  },
  lloyd: {
    name: 'Lloyd',
    slug: 'lloyd',
    categoryTag: 'Rapid Cooling Air Conditioners',
    tagline: 'Rapid 52°C Ambient Cooling Inverter ACs with Golden Fin Protection',
    description:
      'Lloyd air conditioners available through Vijaya Durga Refrigeration showroom in Ravulapalem. Known for robust rapid cooling even at extreme ambient temperatures of 52°C, 4-way air swing, and golden fin anti-corrosion condenser technology.',
    highlights: [
      'Rapid Cooling Capacity Engineered for 52°C High Ambient Heat',
      'Golden Fin Anti-Corrosive Condenser Protection',
      '4-Way Motorized Air Circulation for Uniform Room Cooling',
      'Clean Hidden Digital LED Temperature Display',
    ],
  },
  'mitsubishi-electric': {
    name: 'Mitsubishi Electric',
    slug: 'mitsubishi-electric',
    categoryTag: 'Heavy-Duty Inverter Cooling',
    tagline: 'Precision Engineered Heavy Inverter Air Conditioning Systems',
    description:
      'Mitsubishi Electric air conditioning systems featured at Vijaya Durga Refrigeration showroom in Ravulapalem. Renowned for whisper-quiet indoor operation, heavy-duty tropical compressors, dual barrier coating filters, and exceptional durability.',
    highlights: [
      'Heavy-Duty Tropical Inverter Compressor for Relentless Summer Heat',
      'Ultra-Quiet Indoor Airflow Operation',
      'Dual Barrier Coating Filter Protecting Internal Fins from Dust & Oil',
      'Extended Distance Air Throw for Long Living Rooms & Commercial Halls',
    ],
  },
  samsung: {
    name: 'Samsung',
    slug: 'samsung',
    categoryTag: 'Automatic Washing Machines',
    tagline: 'Digital Inverter Automatic Washing Machines with Gentle Fabric Care',
    description:
      'Samsung home laundry appliances featured at Vijaya Durga Refrigeration showroom in Ravulapalem. Offering top-load Wobble technology and front-load Hygiene Steam cycles with energy-saving digital inverter motors.',
    highlights: [
      'Digital Inverter Motor with Low Noise & High Energy Efficiency',
      'Hygiene Steam Wash Cycle Eliminating 99.9% Bacteria',
      'Diamond Drum & Stainless Steel Pulsator for Gentle Fabric Treatment',
      '5 Star BEE Energy Efficiency Rating',
    ],
  },
  'universal-oem': {
    name: 'Universal / OEM',
    slug: 'universal-oem',
    categoryTag: 'AC Spares & Technician Supplies',
    tagline: 'Genuine Replacement Spare Parts & Technical Refrigeration Supplies',
    description:
      'High-grade AC replacement parts, rotary compressors, HVAC copper tubing coils, R-32/R-410A refrigerant gas cylinders, and universal inverter PCB kits available at the VDR Spares Counter in Ravulapalem.',
    highlights: [
      'Rotary Compressors for 1.0T, 1.5T, and 2.0T Split Air Conditioners',
      '100% Deoxidized Seamless Copper Refrigeration Piping Coils',
      'Virgin Grade R-32 & R-410A Refrigerant Cylinders for Technicians',
      'Universal Inverter PCB Motherboard Repair Replacement Kits',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(BRAND_CONFIGS).map((brand) => ({
    brand,
  }));
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const config = BRAND_CONFIGS[brand.toLowerCase()];

  if (!config) {
    notFound();
  }

  // Filter products matching this brand
  const brandProducts = DEMO_PRODUCTS.filter(
    (p) => p.brand.toLowerCase() === config.name.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#475569]">
          <Link
            href="/#catalogue"
            className="inline-flex items-center gap-1 hover:text-[#0A3960] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Catalogue</span>
          </Link>
          <span>/</span>
          <span className="text-slate-400">Brands</span>
          <span>/</span>
          <span className="text-[#0F172A] font-semibold">{config.name}</span>
        </div>

        {/* Brand Showcase Header Card */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF3FA] border border-[#DCEAF5] px-3 py-1 text-xs font-bold text-[#0A3960]">
                <Sparkles className="h-3.5 w-3.5 text-[#0284C7]" />
                <span>{config.categoryTag}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-heading">
                {config.name} at Vijaya Durga Refrigeration
              </h1>

              <p className="text-base font-semibold text-[#0A3960] font-heading">
                {config.tagline}
              </p>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {config.description}
              </p>
            </div>

            {/* Quick Contact Box */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3 shrink-0 md:w-72">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A3960]">
                <MapPin className="h-4 w-4 text-[#0284C7]" />
                <span>Ravulapalem Showroom</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Inquire directly about current {config.name} model availability and pricing at our Market Road store.
              </p>
              <a
                href={generateGeneralWhatsAppLink(
                  `Hi Vijaya Durga Refrigeration, I am inquiring about ${config.name} models available at your Ravulapalem showroom.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Inquire for {config.name}</span>
              </a>
            </div>
          </div>

          {/* Key Engineering Highlights Grid */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {config.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-[#F8FAFC] border border-slate-200/70 p-3 text-xs text-[#0F172A] font-medium leading-snug"
              >
                <span className="text-[#0284C7] font-bold mr-1.5">✓</span>
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          {/* Trademark Notice */}
          <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-400">
            <ShieldAlert className="h-3.5 w-3.5 text-[#0284C7] shrink-0 mt-0.5" />
            <p>
              Notice: {config.name} brand name, logos, and trademarks belong exclusively to their respective manufacturer. Vijaya Durga Refrigeration is an independent showroom retailing genuine appliances and compatible spare parts.
            </p>
          </div>
        </div>

        {/* Brand Models Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight font-heading">
              {config.name} Catalogue Models ({brandProducts.length})
            </h2>
            <Link
              href="/#catalogue"
              className="text-xs font-semibold text-[#0284C7] hover:underline"
            >
              View Full Showroom Catalogue →
            </Link>
          </div>

          {brandProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {brandProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center space-y-2">
              <p className="text-sm font-semibold text-[#0F172A]">
                Sample models for {config.name} currently being updated.
              </p>
              <p className="text-xs text-[#475569]">
                Contact our showroom desk for specific model inquiries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
