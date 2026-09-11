// src/app/products/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  ShieldAlert,
  Info,
  CheckCircle2,
  Star,
  Scale,
} from 'lucide-react';
import {
  DEMO_PRODUCTS,
  generateWhatsAppLink,
  VDR_BUSINESS_INFO,
} from '@/data/catalogue';
import { getPublicProducts, getPublicProductBySlug } from '@/lib/db/queries';
import ProductCard from '@/components/products/ProductCard';
import ProductGallery from '@/components/products/ProductGallery';
import ProductMobileBar from '@/components/products/ProductMobileBar';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const dbProducts = await getPublicProducts();
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({ slug: p.slug }));
    }
  } catch {
    // fallback
  }
  return DEMO_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let product = await getPublicProductBySlug(slug);
  if (!product) {
    product = DEMO_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  if (!product) {
    return {
      title: 'Product Not Found | Vijaya Durga Refrigeration',
    };
  }

  return {
    title: `${product.name} | ${product.brand} Showroom Ravulapalem | VDR`,
    description: `${product.description || product.shortSummary} Available for showroom inquiry at Vijaya Durga Refrigeration, Market Road, Ravulapalem.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let product = await getPublicProductBySlug(slug);
  if (!product) {
    product = DEMO_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  if (!product) {
    notFound();
  }

  // Related products from the same category
  const relatedProducts = DEMO_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  // Clean structured specification rows strictly filtering for existing fields only
  const coreSpecRows: Array<{ label: string; value?: string | number }> = [
    { label: 'Brand', value: product.brand },
    { label: 'Model Reference', value: product.model },
    { label: 'SKU Code', value: product.sku },
    { label: 'Category', value: product.categoryName },
    { label: 'Capacity / Sizing', value: product.tonnageOrCapacity },
    { label: 'Energy Rating', value: product.starRating ? `${product.starRating} Star BEE` : undefined },
    { label: 'Cooling Technology', value: product.coolingType },
    { label: 'Refrigerant', value: product.refrigerant },
    { label: 'ISEER Energy Efficiency', value: product.iseer },
    { label: 'Annual Power Consumption', value: product.powerConsumption },
    { label: 'Condenser Coil Material', value: product.coilMaterial },
    ...(product.detailedSpecs || [])
      .filter(
        (s) =>
          !['Brand', 'Model Series', 'Model', 'SKU Reference', 'Capacity', 'Energy Rating', 'Cooling Type', 'Refrigerant', 'ISEER', 'Power Consumption', 'Condenser Coil', 'Coil Material'].includes(s.label)
      )
      .map((s) => ({ label: s.label, value: s.value })),
    { label: 'Manufacturer Warranty Terms', value: product.warranty },
    { label: 'Showroom Availability', value: product.availability },
  ];

  const visibleSpecs = coreSpecRows.filter((r) => r.value !== undefined && r.value !== null && r.value !== '');

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 pb-24 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Breadcrumb & Back Navigation */}
        <div className="flex items-center gap-2 text-xs text-[var(--vdr-text-secondary)]">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1 hover:text-[var(--vdr-navy)] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Catalogue</span>
          </Link>
          <span>/</span>
          <Link
            href={`/catalogue?category=${product.category}`}
            className="text-[var(--vdr-text-muted)] hover:text-[var(--vdr-navy)] transition-colors"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-[var(--vdr-text-primary)] font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* Product Hero Grid (Clean 12px radius) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-xl border border-[var(--vdr-border)] p-6 sm:p-8 shadow-xs">
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-5">
            <ProductGallery
              images={product.images || [product.primaryImage || product.imageUrl]}
              productName={product.name}
              isDemo={product.isDemo}
            />
          </div>

          {/* Right: Essential Information & Inquiry Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-md bg-[var(--vdr-navy)] text-white text-xs font-bold px-3 py-1 font-heading">
                  {product.brand}
                </span>

                {product.isDemo && (
                  <span className="rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-2.5 py-1">
                    Demo Preview
                  </span>
                )}

                {product.starRating && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-md tabular-nums">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.starRating}★ BEE Rating</span>
                  </span>
                )}

                <Link
                  href="/compare"
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-[var(--vdr-navy)] text-xs font-semibold px-2.5 py-1 rounded-md transition-colors"
                >
                  <Scale className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                  <span>Compare Models</span>
                </Link>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vdr-text-primary)] tracking-tight font-heading">
                {product.name}
              </h1>

              {product.model && (
                <p className="text-xs text-[var(--vdr-text-secondary)] font-mono tabular-nums">
                  Model: <span className="font-semibold text-slate-800">{product.model}</span>
                  {product.sku && <span> • SKU: {product.sku}</span>}
                </p>
              )}

              <p className="text-sm text-[var(--vdr-text-secondary)] leading-relaxed pt-1">
                {product.description || product.shortSummary}
              </p>
            </div>

            {/* Room Suitability Guideline */}
            {product.suitableFor && (
              <div className="rounded-lg bg-slate-50 border border-[var(--vdr-border)] p-3 text-xs text-[var(--vdr-text-primary)] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0" />
                <span><strong>Recommended Fit:</strong> {product.suitableFor}</span>
              </div>
            )}

            {/* Key Features List */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 pt-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--vdr-text-secondary)] font-heading">
                  Product Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--vdr-status-success)] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversion Triggers: Exclusive Emerald WhatsApp + Direct Showroom Phone */}
            <div className="pt-4 border-t border-[var(--vdr-border)] space-y-3">
              <div className="text-xs text-[var(--vdr-text-secondary)]">
                <strong className="text-[var(--vdr-text-primary)]">Pricing & Availability:</strong> Contact our showroom for current stock verification and competitive local pricing.
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={generateWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] flex-1 rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs sm:text-sm font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <a
                  href={VDR_BUSINESS_INFO.phoneCall}
                  className="min-h-[44px] rounded-lg bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs sm:text-sm font-semibold px-6 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4 text-[var(--vdr-cyan)]" />
                  <span>Call Showroom</span>
                </a>
              </div>
            </div>

            {/* Honest Warranty & Stock Notice */}
            <div className="rounded-lg bg-slate-50 border border-[var(--vdr-border)] p-4 text-xs text-[var(--vdr-text-secondary)] space-y-2">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                <span>{product.showroomAvailabilityNote || product.availability}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                <span>{product.warranty || product.warrantyDisclaimer}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Technical Specifications Table (Clean 12px radius, tabular-nums) */}
        <div className="rounded-xl border border-[var(--vdr-border)] bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--vdr-border)] pb-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
              Technical Specifications
            </h2>
            <span className="text-xs text-[var(--vdr-text-muted)]">
              Only verified model fields displayed
            </span>
          </div>

          <div className="border border-[var(--vdr-border)] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse tabular-nums">
              <tbody>
                {visibleSpecs.map((spec, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}
                  >
                    <td className="py-3 px-4 font-semibold text-[var(--vdr-navy)] w-1/3 border-b border-slate-100">
                      {spec.label}
                    </td>
                    <td className="py-3 px-4 text-[var(--vdr-text-primary)] border-b border-slate-100">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Products from Same Category */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[var(--vdr-border)]">
            <h2 className="text-lg font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
              More in {product.categoryName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Persistent Conversion Bar */}
      <ProductMobileBar product={product} />
    </div>
  );
}
