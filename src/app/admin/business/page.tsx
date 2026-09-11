// src/app/admin/business/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminBusinessPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [popularName, setPopularName] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [town, setTown] = useState('');
  const [pincode, setPincode] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [phoneCall, setPhoneCall] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [hoursMonSat, setHoursMonSat] = useState('');
  const [hoursSunday, setHoursSunday] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [googleBusiness, setGoogleBusiness] = useState('');

  const fetchBusinessInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/business');
      if (!res.ok) throw new Error('Failed to load business info');
      const data = await res.json();
      const b = data.business;
      if (b) {
        setName(b.name || '');
        setPopularName(b.popularName || '');
        setStreet(b.street || '');
        setLandmark(b.landmark || '');
        setTown(b.town || '');
        setPincode(b.pincode || '');
        setFullAddress(b.fullAddress || '');
        setGoogleMapsUrl(b.googleMapsUrl || '');
        setPhoneDisplay(b.phoneDisplay || '');
        setPhoneCall(b.phoneCall || '');
        setWhatsappNumber(b.whatsappNumber || '');
        setHoursMonSat(b.hoursMonSat || '');
        setHoursSunday(b.hoursSunday || '');
        setInstagram(b.socialInstagram || '');
        setFacebook(b.socialFacebook || '');
        setGoogleBusiness(b.socialGoogleBusiness || '');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading business details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setFeedback('');

    try {
      const payload = {
        name,
        popularName,
        street,
        landmark,
        town,
        pincode,
        fullAddress,
        googleMapsUrl,
        phoneDisplay,
        phoneCall,
        whatsappNumber,
        hoursMonSat,
        hoursSunday,
        socialInstagram: instagram,
        socialFacebook: facebook,
        socialGoogleBusiness: googleBusiness,
      };

      const res = await fetch('/api/admin/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update business details');

      setFeedback('Business information saved and reflected across the showroom.');
      setTimeout(() => setFeedback(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error updating business info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-xs text-slate-500">Loading showroom details...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] font-heading">
            Showroom & Business Details
          </h1>
          <p className="text-xs text-[var(--vdr-text-secondary)] mt-0.5">
            Manage physical location, phone helplines, trade opening hours, and digital map links.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shrink-0"
        >
          <Save className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
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
        {/* Section 1: Business Identity & Contact */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
              1. General & Helplines
            </h2>
            <p className="text-xs text-slate-500">Official business naming and customer telephone points.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Official Business Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Trade Signboard Name</label>
              <input
                type="text"
                value={popularName}
                onChange={(e) => setPopularName(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Helpline Display Text</label>
              <input
                type="text"
                value={phoneDisplay}
                onChange={(e) => setPhoneDisplay(e.target.value)}
                placeholder="e.g. +91 98490 00000"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Telephone Call Link</label>
              <input
                type="text"
                value={phoneCall}
                onChange={(e) => setPhoneCall(e.target.value)}
                placeholder="e.g. tel:+919849000000"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Showroom WhatsApp Number (Country Code + 10 Digits)</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 919849012345 (Leave empty to use client prompt selector)"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
              <p className="text-[11px] text-slate-400">All WhatsApp enquiry buttons across the site route directly to this phone number.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Showroom Physical Location */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
              2. Showroom Location & Maps
            </h2>
            <p className="text-xs text-slate-500">Physical address in Ravulapalem and verified Google Maps link.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Street / Road</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Landmark</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Town / Mandal</label>
              <input
                type="text"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Full Printable Address</label>
              <input
                type="text"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Google Maps Share URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
                />
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600"
                    title="Test Maps Link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Showroom Operating Hours */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
              3. Showroom Operating Hours
            </h2>
            <p className="text-xs text-slate-500">Opening schedule shown on footer, showroom page, and contact modal.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Monday to Saturday</label>
              <input
                type="text"
                value={hoursMonSat}
                onChange={(e) => setHoursMonSat(e.target.value)}
                placeholder="e.g. 9:00 AM – 9:00 PM"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Sunday</label>
              <input
                type="text"
                value={hoursSunday}
                onChange={(e) => setHoursSunday(e.target.value)}
                placeholder="e.g. 10:00 AM – 2:00 PM"
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Social & Local Presence */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
              4. Social & Digital Presence
            </h2>
            <p className="text-xs text-slate-500">Social profiles and local Google Business page links.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Google Business URL</label>
              <input
                type="text"
                value={googleBusiness}
                onChange={(e) => setGoogleBusiness(e.target.value)}
                placeholder="https://g.page/..."
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Facebook Page URL</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Instagram Handle / URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full h-9 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
