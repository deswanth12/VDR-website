// src/app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { VDR_BUSINESS_INFO, generateGeneralWhatsAppLink } from '@/data/catalogue';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('ac-purchase');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // 1. Post lead to shared database enquiries table
    try {
      await fetch('/api/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          inquiryType,
          message,
          source: 'website_contact_form',
        }),
      });
    } catch (err) {
      console.error('Failed to log enquiry in database:', err);
    }

    // 2. Build pre-filled WhatsApp message from the form data
    const query = `Hi Vijaya Durga Refrigeration, my name is ${name}. I am inquiring about: ${inquiryType}. Phone: ${phone}. Message: ${message || 'Please let me know showroom details.'}`;
    window.open(generateGeneralWhatsAppLink(query), '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--vdr-cyan)] uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            <span>Showroom & Service Desk</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--vdr-text-primary)] tracking-tight font-heading">
            Contact Vijaya Durga Refrigeration
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vdr-text-secondary)]">
            Have a question about AC models, washing machines, or refrigeration spare parts? Reach our Ravulapalem showroom desk directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Contact Form (Clean 12px radius) */}
          <div className="lg:col-span-7 rounded-xl border border-[var(--vdr-border)] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--vdr-text-primary)] font-heading border-b border-[var(--vdr-border)] pb-3">
              Send an Inquiry
            </h2>

            {submitted ? (
              <div className="rounded-lg bg-[var(--vdr-ice)] border border-[#DCEAF5] p-6 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-[var(--vdr-status-success)] mx-auto" />
                <h3 className="text-base font-bold text-[var(--vdr-navy)]">Inquiry Initiated</h3>
                <p className="text-xs text-[var(--vdr-text-secondary)] max-w-sm mx-auto">
                  Your inquiry details have been forwarded to our showroom team via WhatsApp. You can also call us directly during working hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="min-h-[44px] px-4 py-2 text-xs font-semibold text-[var(--vdr-navy)] hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contactName" className="text-xs font-semibold text-[var(--vdr-text-secondary)]">Your Name *</label>
                    <input
                      id="contactName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:border-[var(--vdr-cyan)] focus:ring-1 focus:ring-[var(--vdr-cyan)] outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contactPhone" className="text-xs font-semibold text-[var(--vdr-text-secondary)]">Phone Number *</label>
                    <input
                      id="contactPhone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 98490 XXXXX"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:border-[var(--vdr-cyan)] focus:ring-1 focus:ring-[var(--vdr-cyan)] outline-hidden tabular-nums"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="inquiryType" className="text-xs font-semibold text-[var(--vdr-text-secondary)]">Inquiry Type</label>
                  <select
                    id="inquiryType"
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:border-[var(--vdr-cyan)] focus:ring-1 focus:ring-[var(--vdr-cyan)] outline-hidden bg-white"
                  >
                    <option value="AC Purchase (Daikin, Lloyd, Mitsubishi)">Air Conditioner Purchase</option>
                    <option value="Washing Machine Purchase (Samsung)">Washing Machine Purchase</option>
                    <option value="AC Spare Parts / Technician Trade">AC Spare Parts / Trade Inquiry</option>
                    <option value="Installation & Service Consultation">Installation / Service Question</option>
                    <option value="General Showroom Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contactMessage" className="text-xs font-semibold text-[var(--vdr-text-secondary)]">Message / Required Product</label>
                  <textarea
                    id="contactMessage"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are looking for (e.g., 1.5 Ton 5-Star AC, compressor replacement, etc.)..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:border-[var(--vdr-cyan)] focus:ring-1 focus:ring-[var(--vdr-cyan)] outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-[44px] w-full rounded-lg bg-[var(--vdr-status-success)] hover:bg-[#15803D] text-white text-xs sm:text-sm font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Submit & Connect on WhatsApp</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Showroom Details & Map (Clean 12px radius) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-[var(--vdr-border)] bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--vdr-text-primary)] font-heading border-b border-[var(--vdr-border)] pb-3">
                Showroom Details
              </h3>

              <div className="space-y-3 text-xs text-[var(--vdr-text-secondary)]">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[var(--vdr-text-primary)]">Location:</strong>
                    <span>{VDR_BUSINESS_INFO.street}</span>
                    <br />
                    <span className="text-[var(--vdr-navy)] font-semibold">{VDR_BUSINESS_INFO.landmark}</span>
                    <br />
                    <span>{VDR_BUSINESS_INFO.town}, {VDR_BUSINESS_INFO.district} Dist.</span>
                    <br />
                    <span>{VDR_BUSINESS_INFO.state} - {VDR_BUSINESS_INFO.pincode}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[var(--vdr-text-primary)]">Showroom Timings:</strong>
                    <span>{VDR_BUSINESS_INFO.hours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-[var(--vdr-cyan)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[var(--vdr-text-primary)]">Phone:</strong>
                    <a href={VDR_BUSINESS_INFO.phoneCall} className="text-[var(--vdr-navy)] hover:underline font-semibold">
                      {VDR_BUSINESS_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--vdr-border)] flex gap-2">
                <a
                  href={generateGeneralWhatsAppLink('Hi Vijaya Durga Refrigeration, I am contacting you from your website contact page.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] flex-1 rounded-lg bg-[var(--vdr-status-success)] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={VDR_BUSINESS_INFO.phoneCall}
                  className="min-h-[44px] flex-1 rounded-lg bg-[var(--vdr-navy)] text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Phone className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                  <span>Call Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
