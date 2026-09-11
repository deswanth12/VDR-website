// src/app/categories/[category]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, Snowflake, Waves, Wrench, MessageCircle } from 'lucide-react';
import {
  DEMO_PRODUCTS,
  generateGeneralWhatsAppLink,
} from '@/data/catalogue';
import ProductCard from '@/components/products/ProductCard';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

const CATEGORY_META: Record<
  string,
  {
    title: string;
    subtitle: string;
    description: string;
    icon: typeof Snowflake;
    highlights: string[];
  }
> = {
  'split-ac': {
    title: 'Inverter Split Air Conditioners',
    subtitle: 'Residential & Commercial Cooling Solutions',
    description:
      'High-efficiency 3-Star and 5-Star inverter split air conditioners from Daikin, Lloyd, and Mitsubishi Electric. Built for coastal tropical heat with 100% grooved pure copper coils and energy-saving digital inverter compressors.',
    icon: Snowflake,
    highlights: [
      '1.0 Ton, 1.5 Ton, and 2.0 Ton Cooling Capacities',
      '5 Star & 3 Star BEE High-Efficiency Ratings',
      '100% Pure Grooved Copper Heat Exchangers',
      'PM 2.5 Micro-Particle Air Purification Filters',
    ],
  },
  'washing-machine': {
    title: 'Automatic Washing Machines',
    subtitle: 'Top Load & Front Load Laundry Appliances',
    description:
      'Samsung fully automatic washing machines featuring digital inverter motors, Wobble technology, and Hygiene Steam cycles that eliminate 99.9% of bacteria while providing gentle fabric care.',
    icon: Waves,
    highlights: [
      '7.0 kg & 8.0 kg Family Load Capacities',
      '5 Star BEE Energy & Water Efficiency',
      'Hygiene Steam Cycle with 99.9% Bacteria Removal',
      'Long-Lasting Digital Inverter Motors with Low Noise',
    ],
  },
  'ac-spares': {
    title: 'AC Spare Parts & Technician Counter',
    subtitle: 'Genuine Replacement Parts & Refrigeration Supplies',
    description:
      'Dedicated trade supplies for local air conditioning repair mechanics, workshop contractors, and installation technicians in Ravulapalem and Dr. B. R. Ambedkar Konaseema District.',
    icon: Wrench,
    highlights: [
      'Rotary Compressors for 1.0T, 1.5T, and 2.0T Split ACs',
      '100% Deoxidized Pure Copper Refrigeration Coils',
      'Virgin Grade R-32 & R-410A Refrigerant Cylinders',
      'Universal Inverter PCB Boards, Displays & Sensors',
    ],
  },
};

export async function generateStaticParams() {
  return [
    { category: 'split-ac' },
    { category: 'washing-machine' },
    { category: 'ac-spares' },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];

  if (!meta) {
    return { title: 'Category Not Found | Vijaya Durga Refrigeration' };
  }

  return {
    title: `${meta.title} | Vijaya Durga Refrigeration Ravulapalem`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const config = CATEGORY_META[category];

  if (!config) {
    notFound();
  }

  const Icon = config.icon;
  const products = DEMO_PRODUCTS.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#475569]">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1 hover:text-[#0A3960] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Catalogue</span>
          </Link>
          <span>/</span>
          <span className="text-[#0F172A] font-semibold">{config.title}</span>
        </div>

        {/* Category Header Card */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF3FA] border border-[#DCEAF5] px-3.5 py-1 text-xs font-bold text-[#0A3960]">
                <Icon className="h-4 w-4 text-[#0284C7]" />
                <span>Showroom Category Hub</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-heading">
                {config.title}
              </h1>

              <p className="text-base font-semibold text-[#0A3960] font-heading">
                {config.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {config.description}
              </p>
            </div>

            {/* Quick WhatsApp Inquiry */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3 shrink-0 md:w-72">
              <h3 className="text-xs font-bold text-[#0A3960] font-heading">
                Need Help with {config.title}?
              </h3>
              <p className="text-[11px] text-slate-600">
                Connect directly with our Ravulapalem showroom team for current availability and model pricing.
              </p>
              <a
                href={generateGeneralWhatsAppLink(`Hi Vijaya Durga Refrigeration, I am inquiring about ${config.title} available at your showroom.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Highlights */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {config.highlights.map((h, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-[#F8FAFC] border border-slate-200/70 p-3 text-xs text-[#0F172A] font-medium leading-snug"
              >
                <span className="text-[#0284C7] font-bold mr-1.5">✓</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight font-heading">
              Available Models in Category ({products.length})
            </h2>
            <Link
              href="/catalogue"
              className="text-xs font-semibold text-[#0284C7] hover:underline"
            >
              View Full Showroom Catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
