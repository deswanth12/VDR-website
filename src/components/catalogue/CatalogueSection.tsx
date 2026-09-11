// src/components/catalogue/CatalogueSection.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  X,
  Snowflake,
  Waves,
  Wrench,
  Layers,
  Scale,
  AlertCircle,
  SearchX,
  RotateCcw,
} from 'lucide-react';
import {
  DEMO_PRODUCTS,
  ProductCategory,
  CATEGORIES,
  ProductItem,
} from '@/data/catalogue';
import ProductCard from '@/components/products/ProductCard';
import { useCompare } from '@/context/CompareContext';

const BRANDS = [
  'All Brands',
  'Daikin',
  'Lloyd',
  'Mitsubishi Electric',
  'Samsung',
  'Universal / OEM',
];

const CAPACITY_OPTIONS = [
  { label: 'All Capacities', id: 'all' },
  { label: '1.0 Ton', id: '1.0 Ton' },
  { label: '1.5 Ton', id: '1.5 Ton' },
  { label: '2.0 Ton', id: '2.0 Ton' },
  { label: '7.0 kg (Washing)', id: '7.0 kg' },
  { label: '8.0 kg (Washing)', id: '8.0 kg' },
];

const RATING_OPTIONS = [
  { label: 'All Ratings', id: 'all' },
  { label: '5 Star BEE', id: '5' },
  { label: '3 Star BEE', id: '3' },
];

interface CatalogueSectionProps {
  initialCategory?: ProductCategory | 'all';
}

export default function CatalogueSection({
  initialCategory = 'all',
}: CatalogueSectionProps) {
  const [productList, setProductList] = useState<ProductItem[]>(DEMO_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(
    initialCategory
  );
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const { compareItems } = useCompare();

  useEffect(() => {
    fetch('/api/public/products')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load products');
      })
      .then((data) => {
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => {
        console.error('Using offline fallback catalogue', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return productList.filter((item) => {
      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchBrand =
        selectedBrand === 'All Brands' || item.brand === selectedBrand;
      const matchCapacity =
        selectedCapacity === 'all' ||
        item.tonnageOrCapacity?.toLowerCase().includes(selectedCapacity.toLowerCase());
      const matchRating =
        selectedRating === 'all' || item.starRating?.toString() === selectedRating;

      const matchSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.model && item.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.tonnageOrCapacity &&
          item.tonnageOrCapacity.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchBrand && matchCapacity && matchRating && matchSearch;
    });
  }, [
    productList,
    selectedCategory,
    selectedBrand,
    selectedCapacity,
    selectedRating,
    searchQuery,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('All Brands');
    setSelectedCapacity('all');
    setSelectedRating('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'All Brands' ||
    selectedCapacity !== 'all' ||
    selectedRating !== 'all' ||
    searchQuery !== '';

  return (
    <section id="catalogue-section" className="py-12 sm:py-16 bg-white border-b border-[var(--vdr-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--vdr-cyan)] uppercase tracking-wider mb-1">
              <span>Verified Showroom Inventory</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
              Explore Products & Trade Spares
            </h2>
            <p className="text-xs sm:text-sm text-[var(--vdr-text-secondary)] mt-0.5 max-w-2xl">
              Air conditioners, automatic washing machines, and genuine replacement spare parts. Inquire on WhatsApp for showroom pricing and stock availability.
            </p>
          </div>

          {compareItems.length > 0 && (
            <Link
              href="/compare"
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--vdr-navy)] text-white text-xs font-semibold hover:bg-[var(--vdr-navy-hover)] transition-colors self-start md:self-auto shadow-xs tabular-nums"
            >
              <Scale className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
              <span>Compare Selected ({compareItems.length})</span>
            </Link>
          )}
        </div>

        {/* 1. DOMINANT SEARCH BAR with 44px touch height */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--vdr-cyan)]" />
          <input
            type="text"
            placeholder="Search by model, brand (Daikin, Lloyd, Mitsubishi, Samsung), capacity, or part..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-9 bg-white border border-[var(--vdr-border-strong)] focus:border-[var(--vdr-cyan)] focus:ring-1 focus:ring-[var(--vdr-cyan)] rounded-xl text-xs sm:text-sm text-[var(--vdr-text-primary)] placeholder:text-slate-400 outline-hidden transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Factual Audit Banner */}
        <div className="rounded-xl bg-[var(--vdr-ice)] border border-[#DCEAF5] p-3 sm:p-3.5 flex items-start gap-3 text-xs text-[var(--vdr-navy)]">
          <AlertCircle className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold">Demo Catalogue Preview:</strong> Listings on this platform are sample items for digital demonstration. Contact our Ravulapalem showroom directly to confirm real-time inventory, pricing, and manufacturer warranties.
          </div>
        </div>

        {/* 2. CATEGORY TABS & SPEC FILTER TOGGLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--vdr-border)] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-[var(--vdr-navy)] text-white shadow-xs'
                      : 'bg-white border border-[var(--vdr-border)] text-[var(--vdr-text-secondary)] hover:border-[var(--vdr-border-strong)] hover:text-[var(--vdr-text-primary)]'
                  }`}
                >
                  {cat.id === 'split-ac' && <Snowflake className="h-3.5 w-3.5" />}
                  {cat.id === 'washing-machine' && <Waves className="h-3.5 w-3.5" />}
                  {cat.id === 'ac-spares' && <Wrench className="h-3.5 w-3.5" />}
                  {cat.id === 'all' && <Layers className="h-3.5 w-3.5" />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors self-start sm:self-auto cursor-pointer ${
              showAdvancedFilters || selectedCapacity !== 'all' || selectedRating !== 'all'
                ? 'bg-[var(--vdr-ice)] border-[var(--vdr-cyan)] text-[var(--vdr-navy)]'
                : 'bg-white border-[var(--vdr-border)] text-[var(--vdr-text-secondary)] hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
            <span>Filter Specs {selectedCapacity !== 'all' || selectedRating !== 'all' ? '(Active)' : ''}</span>
          </button>
        </div>

        {/* 3. BRAND SELECTOR CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-[var(--vdr-text-muted)] mr-1 hidden sm:inline">
            Brand:
          </span>
          {BRANDS.map((brand) => {
            const active = selectedBrand === brand;
            return (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[var(--vdr-cyan)] text-white font-semibold shadow-2xs'
                    : 'bg-white border border-[var(--vdr-border)] text-[var(--vdr-text-secondary)] hover:border-[var(--vdr-border-strong)] hover:text-[var(--vdr-text-primary)]'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>

        {/* 4. ADVANCED SPECIFICATION FILTER PANEL */}
        {showAdvancedFilters && (
          <div className="rounded-xl border border-[var(--vdr-border)] bg-slate-50/60 p-4 sm:p-5 space-y-4 animate-in fade-in-50 duration-150 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-bold text-[var(--vdr-text-primary)] uppercase tracking-wider block mb-2">
                  Tonnage / Capacity
                </label>
                <div className="flex flex-wrap gap-2">
                  {CAPACITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedCapacity(opt.id)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer tabular-nums ${
                        selectedCapacity === opt.id
                          ? 'bg-[var(--vdr-navy)] text-white border-[var(--vdr-navy)]'
                          : 'bg-white border-[var(--vdr-border)] text-[var(--vdr-text-secondary)] hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[var(--vdr-text-primary)] uppercase tracking-wider block mb-2">
                  BEE Star Rating (Energy Efficiency)
                </label>
                <div className="flex flex-wrap gap-2">
                  {RATING_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedRating(opt.id)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer tabular-nums ${
                        selectedRating === opt.id
                          ? 'bg-[var(--vdr-navy)] text-white border-[var(--vdr-navy)]'
                          : 'bg-white border-[var(--vdr-border)] text-[var(--vdr-text-secondary)] hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="pt-3 border-t border-[var(--vdr-border)] flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-xs text-[var(--vdr-cyan)] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5. ACTIVE FILTERS SUMMARY & COUNT */}
        <div className="flex items-center justify-between text-xs text-[var(--vdr-text-secondary)]">
          <p>
            Showing <strong className="text-[var(--vdr-text-primary)] font-bold tabular-nums">{filteredProducts.length}</strong>{' '}
            showroom models
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[var(--vdr-cyan)] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* 6. PRODUCT GRID OR SKELETON / EMPTY STATE */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-96 rounded-xl border border-[var(--vdr-border)] bg-slate-50 animate-pulse p-4 space-y-4"
              >
                <div className="h-48 bg-slate-200 rounded-lg" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-10 bg-slate-200 rounded-lg mt-4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* 7. POLISHED EMPTY STATE */
          <div className="rounded-xl border border-dashed border-[var(--vdr-border-strong)] bg-white p-12 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-[var(--vdr-ice)] flex items-center justify-center text-[var(--vdr-cyan)]">
              <SearchX className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[var(--vdr-text-primary)] font-heading">
                No matching models found
              </h3>
              <p className="text-xs text-[var(--vdr-text-secondary)] max-w-sm mx-auto">
                No items match your selected filters. Try broadening your keywords or resetting your brand/capacity filters.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--vdr-navy)] text-white text-xs font-semibold hover:bg-[var(--vdr-navy-hover)] transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
