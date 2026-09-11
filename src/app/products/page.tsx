// src/app/products/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CatalogueSection from '@/components/catalogue/CatalogueSection';
import { ProductCategory } from '@/data/catalogue';

function ProductsCatalogueContent() {
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

  return <CatalogueSection key={categoryParam} initialCategory={categoryParam} />;
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-slate-500">
            Loading showroom catalogue...
          </div>
        }
      >
        <ProductsCatalogueContent />
      </Suspense>
    </div>
  );
}
