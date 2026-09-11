// src/app/admin/homepage/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  // Hero section state
  const [headline, setHeadline] = useState('');
  const [supportingText, setSupportingText] = useState('');
  const [locationPill, setLocationPill] = useState('');
  const [primaryCtaText, setPrimaryCtaText] = useState('');
  const [primaryCtaLink, setPrimaryCtaLink] = useState('');
  const [secondaryCtaText, setSecondaryCtaText] = useState('');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState('');

  const fetchHomepageContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/homepage');
      if (!res.ok) throw new Error('Failed to load homepage content');
      const data = await res.json();
      const sections = data.sections || [];

      // Extract Hero section
      const heroSec = sections.find((s: any) => s.sectionKey === 'hero');
      if (heroSec && heroSec.content) {
        const c = heroSec.content;
        setHeadline(c.headline || '');
        setSupportingText(c.supportingText || '');
        setLocationPill(c.locationPill || '');
        setPrimaryCtaText(c.primaryCtaText || '');
        setPrimaryCtaLink(c.primaryCtaLink || '');
        setSecondaryCtaText(c.secondaryCtaText || '');
        setSecondaryCtaLink(c.secondaryCtaLink || '');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading homepage copy');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setFeedback('');

    try {
      const payload = {
        sectionKey: 'hero',
        content: {
          headline,
          supportingText,
          locationPill,
          primaryCtaText,
          primaryCtaLink,
          secondaryCtaText,
          secondaryCtaLink,
        },
      };

      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update homepage content');

      setFeedback('Homepage hero content updated and published live.');
      setTimeout(() => setFeedback(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error updating content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-xs text-slate-500">Loading homepage content...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] font-heading">
            Homepage Content Editor
          </h1>
          <p className="text-xs text-[var(--vdr-text-secondary)] mt-0.5">
            Manage storefront headline copy, trust badge location text, and call-to-action buttons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 rounded-md border border-[var(--vdr-border)] bg-white hover:bg-[var(--vdr-surface-subtle)] text-slate-600 text-xs font-semibold flex items-center gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Live</span>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shrink-0"
          >
            <Save className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in-50">
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

      {/* Unified Document Form */}
      <div className="bg-white border border-[var(--vdr-border)] rounded-lg p-6 sm:p-8 space-y-10 shadow-xs">
        {/* Section 1: Hero Showcase */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
              1. Hero Headlines & Messaging
            </h2>
            <p className="text-xs text-slate-500">Primary copy displayed at the top of the homepage above the fold.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Location Trust Pill Badge</label>
              <input
                type="text"
                value={locationPill}
                onChange={(e) => setLocationPill(e.target.value)}
                placeholder="e.g. Ravulapalem, Dr. B.R. Ambedkar Konaseema District"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Main Hero Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Authorized Air Conditioning & Home Appliance Showroom"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] font-bold focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Supporting Subtitle Paragraph</label>
              <textarea
                rows={3}
                value={supportingText}
                onChange={(e) => setSupportingText(e.target.value)}
                placeholder="e.g. Discover genuine Daikin, Lloyd, and Mitsubishi Electric cooling systems..."
                className="w-full p-2.5 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Action Targets */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
              2. Call-to-Action Buttons
            </h2>
            <p className="text-xs text-slate-500">Destination links and labels for homepage hero action buttons.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Primary CTA Button Text</label>
              <input
                type="text"
                value={primaryCtaText}
                onChange={(e) => setPrimaryCtaText(e.target.value)}
                placeholder="e.g. Explore Inverter ACs"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Primary CTA Target URL</label>
              <input
                type="text"
                value={primaryCtaLink}
                onChange={(e) => setPrimaryCtaLink(e.target.value)}
                placeholder="e.g. /categories/split-ac"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Secondary CTA Button Text</label>
              <input
                type="text"
                value={secondaryCtaText}
                onChange={(e) => setSecondaryCtaText(e.target.value)}
                placeholder="e.g. Visit Showroom"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Secondary CTA Target URL</label>
              <input
                type="text"
                value={secondaryCtaLink}
                onChange={(e) => setSecondaryCtaLink(e.target.value)}
                placeholder="e.g. /showroom"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
