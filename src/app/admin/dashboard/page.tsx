// src/app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Layers,
  Award,
  MessageSquare,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
} from 'lucide-react';

interface DashboardData {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalBrands: number;
  totalEnquiries: number;
  newEnquiries: number;
  recentEnquiries: any[];
  recentProducts: any[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [productsRes, enquiriesRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/enquiries'),
      ]);

      if (!productsRes.ok || !enquiriesRes.ok) throw new Error('Failed to load dashboard data');

      const productsData = await productsRes.json();
      const enquiriesData = await enquiriesRes.json();

      const allProducts = productsData.products || [];
      const allEnquiries = enquiriesData.enquiries || [];

      const uniqueCats = new Set(allProducts.map((p: any) => p.categoryId));
      const uniqueBrands = new Set(allProducts.map((p: any) => p.brandId));

      setData({
        totalProducts: allProducts.length,
        activeProducts: allProducts.filter((p: any) => p.isActive === 1).length,
        totalCategories: uniqueCats.size,
        totalBrands: uniqueBrands.size,
        totalEnquiries: allEnquiries.length,
        newEnquiries: allEnquiries.filter((e: any) => e.status === 'new').length,
        recentEnquiries: allEnquiries.slice(0, 5),
        recentProducts: allProducts.slice(0, 5),
      });
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="h-7 w-7 rounded-full border-2 border-[var(--vdr-cyan)] border-t-transparent animate-spin" />
        <span className="text-xs font-medium text-slate-500">Loading operations overview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center space-y-2">
        <AlertCircle className="h-6 w-6 text-red-600 mx-auto" />
        <h3 className="text-sm font-bold text-red-900">Failed to load dashboard</h3>
        <p className="text-xs text-red-700">{error}</p>
        <button
          onClick={fetchDashboard}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. HEADER & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] tracking-tight font-heading">
            Showroom Operations
          </h1>
          <p className="text-xs text-[var(--vdr-text-secondary)] mt-0.5">
            Vijaya Durga Refrigeration catalogue inventory, leads, and operational status.
          </p>
        </div>

        {/* Compact Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/products/new"
            className="px-3 py-2 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/import"
            className="px-3 py-2 rounded-md border border-[var(--vdr-border)] bg-white hover:bg-[var(--vdr-surface-subtle)] text-[var(--vdr-text-primary)] text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Upload className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
            <span>Bulk Import</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 rounded-md border border-[var(--vdr-border)] bg-white hover:bg-[var(--vdr-surface-subtle)] text-slate-600 hover:text-slate-900 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            <span>Live Showroom</span>
          </Link>
        </div>
      </div>

      {/* 2. COMPACT KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Products */}
        <div className="p-4 rounded-lg border border-[var(--vdr-border)] bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Catalogue Items</span>
            <Package className="h-4 w-4 text-[var(--vdr-cyan)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--vdr-text-primary)] mt-1 font-heading tabular-nums">
            {data?.totalProducts}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1 tabular-nums">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>{data?.activeProducts} verified active</span>
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 rounded-lg border border-[var(--vdr-border)] bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Categories</span>
            <Layers className="h-4 w-4 text-[var(--vdr-cyan)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--vdr-text-primary)] mt-1 font-heading tabular-nums">
            {data?.totalCategories}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            AC, Washers, Spares
          </div>
        </div>

        {/* Brands */}
        <div className="p-4 rounded-lg border border-[var(--vdr-border)] bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Showroom Brands</span>
            <Award className="h-4 w-4 text-[var(--vdr-cyan)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--vdr-text-primary)] mt-1 font-heading tabular-nums">
            {data?.totalBrands}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Daikin, Lloyd, Mitsubishi, Samsung
          </div>
        </div>

        {/* Enquiries */}
        <div className="p-4 rounded-lg border border-[var(--vdr-border)] bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Customer Enquiries</span>
            <MessageSquare className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[var(--vdr-text-primary)] mt-1 font-heading tabular-nums">
            {data?.totalEnquiries}
          </div>
          <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-1 tabular-nums">
            <Clock className="h-3 w-3 text-amber-600" />
            <span>{data?.newEnquiries} uncontacted leads</span>
          </div>
        </div>
      </div>

      {/* 3. OPERATIONAL DATA TABLES */}
      <div className="space-y-8 pt-2">
        {/* Recent Enquiries Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[var(--vdr-cyan)]" />
                <span>Recent Customer Enquiries</span>
              </h2>
              <p className="text-xs text-slate-500">Latest enquiries submitted through public contact forms and showroom links.</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[var(--vdr-cyan)] hover:underline flex items-center gap-1"
            >
              <span>View All Enquiries</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="border border-[var(--vdr-border)] rounded-lg overflow-hidden bg-white shadow-xs">
            {data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[var(--vdr-text-primary)]">
                  <thead className="bg-[var(--vdr-surface-subtle)] border-b border-[var(--vdr-border)] text-slate-600 font-semibold">
                    <tr className="h-9">
                      <th className="py-2 px-4">Customer</th>
                      <th className="py-2 px-4">Phone / Contact</th>
                      <th className="py-2 px-4">Product Requested</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentEnquiries.map((enq) => (
                      <tr key={enq.id} className="h-10 hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-4 font-semibold text-[var(--vdr-text-primary)]">{enq.customerName}</td>
                        <td className="py-2 px-4 font-mono text-slate-600 tabular-nums">{enq.phone}</td>
                        <td className="py-2 px-4 text-slate-700 max-w-xs truncate">
                          {enq.productName || 'General Showroom Inquiry'}
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              enq.status === 'new'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : enq.status === 'contacted'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-slate-500 whitespace-nowrap tabular-nums">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <Link
                            href="/admin/enquiries"
                            className="text-[var(--vdr-cyan)] hover:underline font-semibold text-[11px]"
                          >
                            Open CRM →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No customer enquiries recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Recently Added Products Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading flex items-center gap-2">
                <Package className="h-4 w-4 text-[var(--vdr-cyan)]" />
                <span>Recently Added Catalogue Items</span>
              </h2>
              <p className="text-xs text-slate-500">Latest appliances and trade spare parts registered in the showroom catalogue.</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[var(--vdr-cyan)] hover:underline flex items-center gap-1"
            >
              <span>View All Inventory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="border border-[var(--vdr-border)] rounded-lg overflow-hidden bg-white shadow-xs">
            {data?.recentProducts && data.recentProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[var(--vdr-text-primary)]">
                  <thead className="bg-[var(--vdr-surface-subtle)] border-b border-[var(--vdr-border)] text-slate-600 font-semibold">
                    <tr className="h-9">
                      <th className="py-2 px-4">Product Name</th>
                      <th className="py-2 px-4">Brand</th>
                      <th className="py-2 px-4">Category</th>
                      <th className="py-2 px-4">SKU / Model</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentProducts.map((p) => (
                      <tr key={p.id} className="h-10 hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-4 font-semibold text-[var(--vdr-text-primary)] max-w-sm truncate">
                          {p.name}
                        </td>
                        <td className="py-2 px-4 text-slate-700">{p.brandName}</td>
                        <td className="py-2 px-4 font-mono text-[11px] text-slate-500">{p.categoryName}</td>
                        <td className="py-2 px-4 font-mono text-[11px] text-slate-600 tabular-nums">{p.sku || p.model || '—'}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.isActive === 1
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {p.isActive === 1 ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="text-[var(--vdr-cyan)] hover:underline font-semibold text-[11px]"
                          >
                            Edit →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No products registered in the showroom yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
