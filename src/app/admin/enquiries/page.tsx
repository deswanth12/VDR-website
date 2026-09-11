// src/app/admin/enquiries/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Lead editing state
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [notesUpdate, setNotesUpdate] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/enquiries');
      if (!res.ok) throw new Error('Failed to load enquiries');
      const data = await res.json();
      setEnquiries(data.enquiries || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const openEditModal = (enq: any) => {
    setSelectedEnquiry(enq);
    setStatusUpdate(enq.status);
    setNotesUpdate(enq.internalNotes || '');
    setModalOpen(true);
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusUpdate,
          internalNotes: notesUpdate.trim(),
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update enquiry');
      }

      setFeedback(`Lead for "${selectedEnquiry.customerName}" updated.`);
      setModalOpen(false);
      fetchEnquiries();
      setTimeout(() => setFeedback(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error updating lead');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to delete');
      }
      setFeedback('Enquiry deleted.');
      fetchEnquiries();
      setTimeout(() => setFeedback(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error deleting enquiry');
    }
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.customerName.toLowerCase().includes(q) ||
      item.phone.includes(q) ||
      (item.productName && item.productName.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] font-heading">
            Customer Inquiries & Leads
          </h1>
          <p className="text-xs text-[var(--vdr-text-secondary)] mt-0.5">
            Operational CRM for managing showroom product enquiries, installation requests, and trade calls.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[var(--vdr-status-success)] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* CRM DATA TABLE WITH INTEGRATED TOOLBAR */}
      <div className="border border-[var(--vdr-border)] rounded-lg bg-white overflow-hidden shadow-xs">
        {/* Integrated Filter Toolbar */}
        <div className="p-3 bg-[var(--vdr-surface-subtle)] border-b border-[var(--vdr-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone number, or message..."
              className="w-full h-8 pl-8 pr-3 rounded-md border border-[var(--vdr-border-strong)] bg-white text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none min-w-0 h-8 px-2.5 rounded-md border border-[var(--vdr-border-strong)] bg-white text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
            >
              <option value="all">All Statuses</option>
              <option value="new">New (Uncontacted)</option>
              <option value="contacted">Contacted</option>
              <option value="follow-up">Follow-up Required</option>
              <option value="closed">Closed / Completed</option>
            </select>

            <button
              type="submit"
              className="h-8 px-3 rounded-md bg-[var(--vdr-cyan)] hover:bg-[var(--vdr-cyan-hover)] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Inquiries Table */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">Loading enquiries...</div>
        ) : filteredEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--vdr-text-primary)]">
              <thead className="bg-[var(--vdr-surface-subtle)] border-b border-[var(--vdr-border)] font-semibold text-slate-600">
                <tr className="h-9">
                  <th className="py-2 px-4">Customer</th>
                  <th className="py-2 px-4">Contact / Direct Action</th>
                  <th className="py-2 px-4">Requested Item & Message</th>
                  <th className="py-2 px-4">Lead Status</th>
                  <th className="py-2 px-4">Created</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="h-14 hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-4 font-bold text-[var(--vdr-text-primary)]">
                      <span>{enq.customerName}</span>
                      {enq.internalNotes && (
                        <p className="text-[11px] text-amber-800 bg-amber-50/80 px-1.5 py-0.5 rounded mt-0.5 max-w-xs truncate border border-amber-200">
                          {enq.internalNotes}
                        </p>
                      )}
                    </td>

                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="font-mono text-slate-700 tabular-nums">{enq.phone}</div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <a
                          href={`tel:${enq.phone}`}
                          title="Call Customer"
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-[var(--vdr-navy)]"
                        >
                          <Phone className="h-3 w-3" />
                        </a>
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${enq.customerName}, this is Vijaya Durga Refrigeration responding to your enquiry regarding ${enq.productName || 'our products'}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Message on WhatsApp"
                          className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-[var(--vdr-status-success)]"
                        >
                          <MessageCircle className="h-3 w-3" />
                        </a>
                      </div>
                    </td>

                    <td className="py-2 px-4 max-w-xs">
                      {enq.productName ? (
                        <p className="font-medium text-[var(--vdr-navy)] truncate">{enq.productName}</p>
                      ) : (
                        <span className="text-slate-500 font-medium">Type: {enq.inquiryType}</span>
                      )}
                      {enq.message && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 pt-0.5">
                          {enq.message}
                        </p>
                      )}
                    </td>

                    <td className="py-2 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          enq.status === 'new'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : enq.status === 'contacted'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : enq.status === 'follow-up'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>

                    <td className="py-2 px-4 whitespace-nowrap text-[11px] text-slate-500 tabular-nums">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-2 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(enq)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[var(--vdr-navy)] text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Manage Lead
                        </button>
                        <button
                          onClick={() => handleDelete(enq.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
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
          <div className="py-16 text-center space-y-2">
            <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[var(--vdr-text-primary)]">No Inquiries Found</h3>
            <p className="text-xs text-[var(--vdr-text-secondary)]">
              Customer leads initiated via website forms or showroom triggers will appear here.
            </p>
          </div>
        )}
      </div>

      {/* LEAD DETAIL & UPDATE MODAL */}
      {modalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 space-y-6 shadow-xl border border-[var(--vdr-border)] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--vdr-border)] pb-3">
              <h3 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
                Customer Lead Information & Follow-up
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Section 1: Customer Contact Info */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Customer Contact
              </span>
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-[var(--vdr-border)] rounded-md">
                <div>
                  <span className="text-slate-500 text-[11px]">Full Name:</span>
                  <p className="font-bold text-[var(--vdr-text-primary)] text-sm">{selectedEnquiry.customerName}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Phone Number:</span>
                  <p className="font-bold font-mono text-[var(--vdr-navy)] text-sm tabular-nums">{selectedEnquiry.phone}</p>
                </div>
              </div>
            </div>

            {/* Section 2: Requested Item / Message */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Requested Item & Context
              </span>
              <div className="p-3 bg-slate-50 border border-[var(--vdr-border)] rounded-md space-y-2">
                <div>
                  <span className="text-slate-500 text-[11px]">Product:</span>
                  <p className="font-semibold text-[var(--vdr-navy)]">{selectedEnquiry.productName || 'General Showroom Inquiry'}</p>
                </div>
                {selectedEnquiry.message && (
                  <div>
                    <span className="text-slate-500 text-[11px]">Customer Note / Message:</span>
                    <p className="text-slate-700 bg-white p-2 rounded border border-[var(--vdr-border)] mt-1">
                      {selectedEnquiry.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: CRM Status & Internal Showroom Follow-up */}
            <form onSubmit={handleUpdateLead} className="space-y-4 text-xs pt-1 border-t border-[var(--vdr-border)]">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Lead Status</label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md border border-[var(--vdr-border-strong)] bg-white text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
                >
                  <option value="new">New (Uncontacted)</option>
                  <option value="contacted">Contacted by Showroom</option>
                  <option value="follow-up">Follow-up Required / Quote Sent</option>
                  <option value="closed">Closed / Purchase Completed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Internal Showroom Notes</label>
                <textarea
                  rows={3}
                  value={notesUpdate}
                  onChange={(e) => setNotesUpdate(e.target.value)}
                  placeholder="Record customer preferences, price quoted, or installation schedule..."
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
                  disabled={updating}
                  className="px-4 py-1.5 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {updating ? 'Saving...' : 'Update Lead Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
