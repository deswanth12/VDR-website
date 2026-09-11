// src/app/admin/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Upload,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  model: string | null;
  sku: string | null;
  tonnageOrCapacity: string | null;
  starRating: number | null;
  shortSummary: string | null;
  primaryImageUrl: string | null;
  isActive: number;
  isFeatured: number;
}

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedBrand !== 'all') params.set('brand', selectedBrand);

      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch(`/api/admin/products?${params.toString()}`),
        fetch('/api/admin/categories'),
        fetch('/api/admin/brands'),
      ]);

      if (!prodRes.ok) throw new Error('Failed to load products');

      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const brandData = await brandRes.json();

      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
      setBrands(brandData.brands || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to delete');
      }
      setFeedback(`Product "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchProducts();
      setTimeout(() => setFeedback(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER & ACTION STRIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
            Catalogue Inventory
          </h1>
          <p className="text-xs text-[var(--vdr-text-secondary)] mt-0.5">
            Manage air conditioners, appliances, and technician spare parts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/import"
            className="px-3 py-2 rounded-md border border-[var(--vdr-border)] bg-white hover:bg-[var(--vdr-surface-subtle)] text-[var(--vdr-text-primary)] text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Upload className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
            <span>Bulk CSV Import</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="px-3.5 py-2 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Feedback message */}
      {feedback && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in-50">
          <CheckCircle2 className="h-4 w-4 text-[var(--vdr-status-success)] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 2. OPERATIONAL DATA TABLE WITH INTEGRATED TOOLBAR */}
      <div className="border border-[var(--vdr-border)] rounded-lg bg-white overflow-hidden shadow-xs">
        {/* Integrated Filter Toolbar */}
        <form
          onSubmit={handleSearchSubmit}
          className="p-3 bg-[var(--vdr-surface-subtle)] border-b border-[var(--vdr-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        >
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, model, SKU, or brand..."
              className="w-full h-8 pl-8 pr-3 rounded-md border border-[var(--vdr-border-strong)] bg-white text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 sm:flex-none min-w-0 h-8 px-2.5 rounded-md border border-[var(--vdr-border-strong)] bg-white text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="flex-1 sm:flex-none min-w-0 h-8 px-2.5 rounded-md border border-[var(--vdr-border-strong)] bg-white text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full sm:w-auto h-8 px-3 rounded-md bg-[var(--vdr-cyan)] hover:bg-[var(--vdr-cyan-hover)] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Filter
            </button>
          </div>
        </form>

        {/* Products Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <div className="h-6 w-6 rounded-full border-2 border-[var(--vdr-cyan)] border-t-transparent animate-spin" />
            <span className="text-xs text-slate-500">Loading catalogue...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--vdr-text-primary)]">
              <thead className="bg-[var(--vdr-surface-subtle)] border-b border-[var(--vdr-border)] font-semibold text-slate-600 sticky top-0">
                <tr className="h-10">
                  <th className="py-2 px-3.5">Product</th>
                  <th className="py-2 px-3.5">Brand & Category</th>
                  <th className="py-2 px-3.5">Model / SKU</th>
                  <th className="py-2 px-3.5">Capacity & Stars</th>
                  <th className="py-2 px-3.5">Status</th>
                  <th className="py-2 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="h-16 hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3.5">
                      <div className="flex items-center gap-3">
                        {p.primaryImageUrl ? (
                          <img
                            src={p.primaryImageUrl}
                            alt={p.name}
                            className="h-10 w-10 rounded-md object-cover bg-slate-100 shrink-0 border border-[var(--vdr-border)]"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                            <Package className="h-4 w-4 text-slate-400" />
                          </div>
                        )}
                        <div className="space-y-0.5 min-w-0 max-w-xs sm:max-w-sm">
                          <p className="font-semibold text-[var(--vdr-text-primary)] truncate">{p.name}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{p.shortSummary}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3.5 text-slate-700">
                      <p className="font-medium">{p.brandName}</p>
                      <p className="text-[11px] text-slate-400">{p.categoryName}</p>
                    </td>
                    <td className="py-2 px-3.5 font-mono text-[11px] tabular-nums">
                      <p className="text-slate-700">{p.model || '—'}</p>
                      <p className="text-slate-400">{p.sku || '—'}</p>
                    </td>
                    <td className="py-2 px-3.5 text-slate-700 tabular-nums">
                      <p>{p.tonnageOrCapacity || '—'}</p>
                      {p.starRating && (
                        <p className="text-[11px] text-amber-600 font-semibold">{p.starRating}★ BEE</p>
                      )}
                    </td>
                    <td className="py-2 px-3.5 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.isActive === 1
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.isActive === 1 ? 'Active' : 'Draft'}
                        </span>
                        {p.isFeatured === 1 && (
                          <span className="block text-[10px] text-amber-600 font-semibold">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1 rounded text-slate-400 hover:text-[var(--vdr-cyan)] hover:bg-slate-100 transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-1 rounded text-[var(--vdr-navy)] hover:bg-slate-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-slate-400">
            No products match the selected filters.
          </div>
        )}
      </div>

      {/* 3. CONFIRM DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 space-y-4 shadow-xl border border-[var(--vdr-border)] animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-50 text-red-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--vdr-text-primary)]">Delete Catalogue Item</h3>
                <p className="text-xs text-slate-500">This action removes the product from the public showroom.</p>
              </div>
            </div>

            <div className="p-3 rounded-md bg-slate-50 border border-[var(--vdr-border)] text-xs">
              <span className="font-semibold text-[var(--vdr-text-primary)]">{deleteTarget.name}</span>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Model: {deleteTarget.model || '—'} | SKU: {deleteTarget.sku || '—'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-3.5 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
