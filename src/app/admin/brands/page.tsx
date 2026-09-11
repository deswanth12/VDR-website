// src/app/admin/brands/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formCategoryTag, setFormCategoryTag] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/brands');
      if (!res.ok) throw new Error('Failed to load brands');
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (err: any) {
      setError(err.message || 'Error loading brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormName('');
    setFormSlug('');
    setFormTagline('');
    setFormCategoryTag('');
    setFormDesc('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (b: any) => {
    setEditingBrand(b);
    setFormName(b.name);
    setFormSlug(b.slug);
    setFormTagline(b.tagline || '');
    setFormCategoryTag(b.categoryTag || '');
    setFormDesc(b.description || '');
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSaving(true);
    setError('');

    try {
      if (editingBrand) {
        const res = await fetch(`/api/admin/brands/${editingBrand.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName.trim(),
            tagline: formTagline.trim(),
            categoryTag: formCategoryTag.trim(),
            description: formDesc.trim(),
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || 'Failed to update');
        }
        setFeedback(`Brand "${formName}" updated.`);
      } else {
        const res = await fetch('/api/admin/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName.trim(),
            slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            tagline: formTagline.trim(),
            categoryTag: formCategoryTag.trim(),
            description: formDesc.trim(),
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || 'Failed to create');
        }
        setFeedback(`Brand "${formName}" added.`);
      }

      setModalOpen(false);
      fetchBrands();
      setTimeout(() => setFeedback(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error saving brand');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (b: any) => {
    if (b.productCount > 0) {
      alert(`Cannot delete brand "${b.name}" because it still has ${b.productCount} models assigned in catalogue.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete brand "${b.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/brands/${b.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to delete');
      }
      setFeedback(`Brand "${b.name}" deleted.`);
      fetchBrands();
      setTimeout(() => setFeedback(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error deleting brand');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] font-heading">
            Showroom Brands
          </h1>
          <p className="text-xs text-[var(--vdr-text-secondary)] mt-0.5">
            Manage partner manufacturers (Daikin, Lloyd, Mitsubishi, Samsung) and brand showcase pages.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
          <span>Add Brand</span>
        </button>
      </div>

      {/* Feedback Alerts */}
      {feedback && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[var(--vdr-status-success)] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Brands Table */}
      <div className="border border-[var(--vdr-border)] rounded-lg bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">Loading brands...</div>
        ) : (
          <table className="w-full text-left text-xs text-[var(--vdr-text-primary)]">
            <thead className="bg-[var(--vdr-surface-subtle)] border-b border-[var(--vdr-border)] font-semibold text-slate-600">
              <tr className="h-9">
                <th className="py-2 px-4">Brand Name</th>
                <th className="py-2 px-4">Specialization Tag</th>
                <th className="py-2 px-4">Tagline</th>
                <th className="py-2 px-4">Active Products</th>
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {brands.map((b) => (
                <tr key={b.id} className="h-11 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-4">
                    <span className="font-bold text-[var(--vdr-navy)] font-heading">{b.name}</span>
                    <p className="font-mono text-[10px] text-slate-400">/brands/{b.slug}</p>
                  </td>
                  <td className="py-2 px-4 font-semibold text-[var(--vdr-cyan)]">{b.categoryTag || '—'}</td>
                  <td className="py-2 px-4 text-slate-600 max-w-xs truncate">{b.tagline || '—'}</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold tabular-nums">
                      {b.productCount} models
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1 rounded text-[var(--vdr-navy)] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Brand"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Brand"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL DIALOG */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 space-y-4 shadow-xl border border-[var(--vdr-border)] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--vdr-border)] pb-3">
              <h3 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingBrand) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Daikin"
                  className="w-full h-8 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
                />
              </div>

              {!editingBrand && (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. daikin"
                    className="w-full h-8 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Category / Specialization Tag</label>
                <input
                  type="text"
                  value={formCategoryTag}
                  onChange={(e) => setFormCategoryTag(e.target.value)}
                  placeholder="e.g. Inverter Air Conditioners"
                  className="w-full h-8 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tagline</label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="e.g. Japanese Precision Engineering"
                  className="w-full h-8 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Brief showroom profile for this manufacturer..."
                  className="w-full p-2.5 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vdr-border)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {saving ? 'Saving...' : editingBrand ? 'Save Changes' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
