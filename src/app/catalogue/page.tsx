// src/app/catalogue/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CatalogueSection from '@/components/catalogue/CatalogueSection';
import { ProductCategory } from '@/data/catalogue';

function CatalogueContent() {
  const searchParams = useSearchParams();
  const categoryRaw = searchParams.get('category');
  const validCategories: (ProductCategory | 'all')[] = [
    'split-ac',
    'washing-machine',
    'ac-spares',
    'all',
  ];
  const categoryParam: ProductCategory | 'all' = validCategories.includes(categoryRaw as ProductCategory)
    ? (categoryRaw as ProductCategory)
    : 'all';

  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-2 text-xs text-[#475569]">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-[#0A3960] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-[#0F172A] font-semibold">Product Catalogue</span>
        </div>
        <h1 className="sr-only">Vijaya Durga Refrigeration Product Catalogue</h1>
      </div>

      <CatalogueSection key={categoryParam} initialCategory={categoryParam} />
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-12">
          <div className="h-8 w-8 rounded-full border-2 border-[#0284C7] border-t-transparent animate-spin" />
        </div>
      }
    >
      <CatalogueContent />
    </Suspense>
  );
}
