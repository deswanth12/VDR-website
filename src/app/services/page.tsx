// src/app/services/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { VDR_BUSINESS_INFO, generateGeneralWhatsAppLink } from '@/data/catalogue';

export const metadata: Metadata = {
  title: 'Services & Support | Vijaya Durga Refrigeration Ravulapalem',
  description:
    'Showroom consultation, AC sizing, technician spares trade counter, installation coordination, and warranty service routing at Vijaya Durga Refrigeration, Ravulapalem.',
};

export default function ServicesPage() {
  const serviceCards = [
    {
      title: 'In-Showroom AC Tonnage & Sizing Consultation',
      badge: 'Sales Assistance',
      desc: 'Selecting the proper air conditioning capacity prevents high electricity bills and poor cooling. We calculate room dimensions, floor level, window exposure, and coastal Godavari ambient conditions to match you with the right 1.0T, 1.5T, or 2.0T inverter unit.',
      features: [
        'Room square footage calculation',
        'Top-floor and direct sunlight heat factor adjustment',
        '3-Star vs 5-Star electricity savings evaluation',
        'Comparison between Daikin, Lloyd, and Mitsubishi Electric models',
      ],
      whatsappQuery: 'Hi Vijaya Durga Refrigeration, I need guidance selecting the right AC tonnage and model for my home.',
    },
    {
      title: 'Technician Trade Counter & Spare Part Testing',
      badge: 'Trade & Mechanic Support',
      desc: 'We operate a dedicated counter for local air conditioning repair mechanics, workshop contractors, and installation technicians. All rotary compressors, copper coils, and refrigerant cylinders are physically inspected at the counter prior to purchase.',
      features: [
        'Rotary compressors for 1.0T, 1.5T, and 2.0T split ACs',
        'Deoxidized pure copper coils (1/4", 3/8", 1/2", 5/8")',
        'Virgin grade R-32 and R-410A refrigerant gas cylinders',
        'Universal inverter PCB control board kits and sensors',
      ],
      whatsappQuery: 'Hi Vijaya Durga Refrigeration, I am an AC repair technician inquiring about spare parts availability and trade counter pricing.',
    },
    {
      title: 'Delivery & Standard Installation Coordination',
      badge: 'Logistics Assistance',
      desc: 'We assist customers in coordinating delivery across Ravulapalem, Amalapuram, and surrounding Konaseema towns, as well as arranging standard split AC or washing machine installation per manufacturer standards.',
      features: [
        'Safe showroom-to-home transit coordination',
        'Unboxing and transit damage check',
        'Guidance on standard vs additional piping requirements',
        'Electrical outlet and stabilizer recommendation',
      ],
      whatsappQuery: 'Hi Vijaya Durga Refrigeration, I have an inquiry about appliance delivery and installation coordination in Ravulapalem.',
    },
    {
      title: 'Manufacturer Warranty & Service Routing',
      badge: 'Customer Support',
      desc: 'All new appliances sold through our showroom come with genuine manufacturer warranty coverage. In the event of a technical issue, we help route service calls directly to authorized brand service centers for Daikin, Lloyd, Mitsubishi Electric, and Samsung.',
      features: [
        'Invoice and warranty card guidance',
        'Official customer care helpline contact routing',
        'Assistance logging technician service visits',
        'Genuine brand replacement part routing',
      ],
      whatsappQuery: 'Hi Vijaya Durga Refrigeration, I need help with warranty service routing for an appliance.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#475569]">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-[#0A3960] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-[#0F172A] font-semibold">Services & Assistance</span>
        </div>

        {/* Hero Section */}
        <div className="rounded-2xl bg-[#0A3960] text-white p-6 sm:p-10 relative overflow-hidden shadow-lg">
          <div className="relative space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#072A47] border border-[#0284C7]/40 px-3 py-1 text-xs font-bold text-[#0284C7]">
              <span>Customer Guidance & Technical Support</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Showroom Services & Trade Assistance
            </h1>

            <p className="text-sm text-slate-200 leading-relaxed">
              At Vijaya Durga Refrigeration, we provide truthful product guidance, dedicated spare parts supply for independent HVAC mechanics, and seamless post-purchase assistance across Ravulapalem and Konaseema district.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={generateGeneralWhatsAppLink('Hi Vijaya Durga Refrigeration, I have an inquiry regarding your showroom services.')}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target px-5 py-2.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enquire on WhatsApp</span>
              </a>

              <a
                href={VDR_BUSINESS_INFO.phoneCall}
                className="touch-target px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-2 border border-white/20"
              >
                <Phone className="h-4 w-4 text-[#0284C7]" />
                <span>Call Showroom Helpline</span>
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceCards.map((srv, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 flex flex-col justify-between shadow-xs hover:border-[#0284C7]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0284C7] bg-[#EBF3FA] px-2.5 py-1 rounded-md">
                    {srv.badge}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[#0F172A] font-heading leading-snug">
                  {srv.title}
                </h2>

                <p className="text-xs text-[#475569] leading-relaxed">
                  {srv.desc}
                </p>

                <div className="space-y-1.5 pt-2">
                  {srv.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={generateGeneralWhatsAppLink(srv.whatsappQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target px-4 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#15803D] transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Enquire via WhatsApp</span>
                </a>

                <span className="text-[11px] text-slate-400">
                  Ravulapalem Desk
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Factual Disclaimer */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500 space-y-1.5">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-700">Service & Warranty Notice:</strong> Vijaya Durga Refrigeration does not make unverified claims regarding service timelines or warranty guarantees. Manufacturer warranties on air conditioners and appliances are serviced directly by the respective brands (Daikin, Lloyd, Mitsubishi Electric, Samsung) according to their official terms.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
