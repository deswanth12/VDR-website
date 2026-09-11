// src/components/common/AssistantEntryPill.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  X,
  MessageCircle,
  Calculator,
  Wrench,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Phone,
  Search,
} from 'lucide-react';
import { DEMO_PRODUCTS, generateWhatsAppLink, generateGeneralWhatsAppLink, VDR_BUSINESS_INFO } from '@/data/catalogue';

export default function AssistantEntryPill() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sizing' | 'qa' | 'spares'>('sizing');

  // Interactive Room Sizing State
  const [roomType, setRoomType] = useState<'standard' | 'master' | 'living' | 'topfloor'>('standard');
  const [roomSqft, setRoomSqft] = useState<number>(140);

  // Local Q&A Search Query State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Tonnage calculation rules (Grounded in coastal Godavari climate requirements)
  const recommendation = useMemo(() => {
    let tonnage = '1.0 Ton';
    let minTonnage = 1.0;
    let reason = 'Ideal for standard bedrooms under normal ambient temperatures.';

    if (roomSqft <= 110 && roomType !== 'topfloor') {
      tonnage = '1.0 Ton';
      minTonnage = 1.0;
      reason = 'Perfect capacity for bedrooms up to 110 sq.ft with standard ceiling height.';
    } else if (roomSqft <= 165 || (roomSqft <= 120 && roomType === 'topfloor')) {
      tonnage = '1.5 Ton';
      minTonnage = 1.5;
      reason =
        roomType === 'topfloor'
          ? 'Recommended 1.5 Ton because top floor rooms absorb higher roof heat.'
          : 'Most popular 1.5 Ton capacity for master bedrooms and medium living spaces.';
    } else {
      tonnage = '2.0 Ton';
      minTonnage = 2.0;
      reason = 'Recommended 2.0 Ton for large halls, open living rooms, or spaces with intense sunlight.';
    }

    // Match products from catalogue
    const matchedProducts = DEMO_PRODUCTS.filter(
      (p) =>
        p.category === 'split-ac' &&
        p.tonnageOrCapacity?.toLowerCase().includes(tonnage.toLowerCase())
    );

    return { tonnage, minTonnage, reason, matchedProducts };
  }, [roomSqft, roomType]);

  // Local Knowledge Retrieval matching customer search keywords
  const matchedQAProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return DEMO_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keySpecs.some((s) => s.value.toLowerCase().includes(q) || s.label.toLowerCase().includes(q))
    ).slice(0, 3);
  }, [searchQuery]);

  return (
    <>
      {/* Floating Pill Trigger (Positioned safely above mobile dock) */}
      <div className="fixed bottom-22 md:bottom-6 right-3 md:right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-2 rounded-full bg-[#0A3960] text-white px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-semibold shadow-lg hover:bg-[#072A47] hover:shadow-xl transition-all duration-200 border border-[#0284C7]/40 cursor-pointer"
          aria-label="Open Ask VDR Product Specialist"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#0284C7] animate-pulse" />
          <Sparkles className="h-4 w-4 text-[#0284C7]" />
          <span className="font-heading tracking-wide">Ask VDR Product Specialist</span>
        </button>
      </div>

      {/* Assistant Modal / Specialist Consultation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#0A3960] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#072A47] flex items-center justify-center border border-[#0284C7]/40">
                  <Sparkles className="h-5 w-5 text-[#0284C7]" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-white font-heading">
                    Ask VDR Product Specialist
                  </h2>
                  <p className="text-[11px] text-[#EBF3FA]">
                    Showroom Sizing & Model Guide • Future RAG Knowledge Interface
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Specialist Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('sizing')}
                className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'sizing'
                    ? 'border-[#0284C7] text-[#0A3960] bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calculator className="h-3.5 w-3.5 text-[#0284C7]" />
                <span>Room Sizing</span>
              </button>

              <button
                onClick={() => setActiveTab('qa')}
                className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'qa'
                    ? 'border-[#0284C7] text-[#0A3960] bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5 text-[#0284C7]" />
                <span>Ask Catalogue</span>
              </button>

              <button
                onClick={() => setActiveTab('spares')}
                className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'spares'
                    ? 'border-[#0284C7] text-[#0A3960] bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Wrench className="h-3.5 w-3.5 text-[#0284C7]" />
                <span>Technician Spares</span>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* TAB 1: INTERACTIVE ROOM AC SIZING CALCULATOR */}
              {activeTab === 'sizing' && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-[#EBF3FA] border border-[#DCEAF5] p-3.5 space-y-1 text-slate-700">
                    <p className="font-bold text-xs text-[#0A3960] font-heading">
                      AC Tonnage Sizing for Coastal Godavari Climate
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Calculated using ambient heat ratings, direct sunlight exposure, and floor position.
                    </p>
                  </div>

                  {/* Room Sqft Slider / Presets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-[#0F172A]">Room Approximate Area:</label>
                      <span className="font-bold text-[#0A3960] text-sm font-heading">{roomSqft} sq.ft</span>
                    </div>

                    <input
                      type="range"
                      min="70"
                      max="280"
                      step="10"
                      value={roomSqft}
                      onChange={(e) => setRoomSqft(Number(e.target.value))}
                      className="w-full accent-[#0284C7] cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>70 sq.ft (Study)</span>
                      <span>150 sq.ft (Bedroom)</span>
                      <span>250+ sq.ft (Hall)</span>
                    </div>
                  </div>

                  {/* Room Type Conditions */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#0F172A] block">Room Exposure Type:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'standard', label: 'Standard Bedroom', desc: 'Normal sun exposure' },
                        { id: 'master', label: 'Master Bedroom', desc: 'Large windows or balconies' },
                        { id: 'topfloor', label: 'Top Floor / Terrace', desc: 'Direct roof sun absorption' },
                        { id: 'living', label: 'Living Room / Hall', desc: 'Multiple family members' },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setRoomType(type.id as 'standard' | 'master' | 'living' | 'topfloor')}
                          className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                            roomType === type.id
                              ? 'bg-[#0A3960] text-white border-[#0A3960]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <p className="font-bold text-[11px]">{type.label}</p>
                          <p className={`text-[10px] ${roomType === type.id ? 'text-slate-200' : 'text-slate-400'}`}>
                            {type.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation Box */}
                  <div className="rounded-xl bg-white border border-[#0284C7]/40 p-4 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Recommended Capacity:</span>
                      <span className="text-base font-extrabold text-[#0A3960] font-heading">
                        {recommendation.tonnage} Inverter AC
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {recommendation.reason}
                    </p>
                  </div>

                  {/* Matching Showroom Models */}
                  {recommendation.matchedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="font-bold text-xs text-[#0F172A]">Available in Showroom ({recommendation.tonnage}):</p>
                      <div className="space-y-2">
                        {recommendation.matchedProducts.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.primaryImage || p.imageUrl}
                                alt={p.name}
                                className="h-9 w-9 object-contain bg-white rounded p-0.5"
                              />
                              <div>
                                <span className="text-[10px] font-bold text-[#0284C7]">{p.brand}</span>
                                <p className="font-semibold text-xs text-[#0F172A] line-clamp-1">{p.name}</p>
                              </div>
                            </div>

                            <a
                              href={generateWhatsAppLink(p)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-md bg-[#16A34A] text-white text-[11px] font-bold flex items-center gap-1 shrink-0"
                            >
                              <MessageCircle className="h-3 w-3" />
                              <span>Enquire</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Custom Sizing CTA */}
                  <a
                    href={generateGeneralWhatsAppLink(
                      `Hi Vijaya Durga Refrigeration, I checked your Room Sizing Tool for a ${roomSqft} sq.ft (${roomType}) space. You recommended a ${recommendation.tonnage} AC. What models and current prices do you have in Ravulapalem?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Inquire for {recommendation.tonnage} on WhatsApp</span>
                  </a>
                </div>
              )}

              {/* TAB 2: LOCAL CATALOGUE GROUNDED Q&A */}
              {activeTab === 'qa' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Type AC question, model name, or star rating..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>

                  {/* Matched items from local catalogue query */}
                  {searchQuery && (
                    <div className="space-y-2">
                      <p className="font-bold text-xs text-[#0F172A]">Matched Showroom Models ({matchedQAProducts.length}):</p>
                      {matchedQAProducts.length > 0 ? (
                        <div className="space-y-2">
                          {matchedQAProducts.map((p) => (
                            <div key={p.id} className="p-3 border border-slate-200 rounded-lg bg-white space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#0284C7]">{p.brand}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{p.tonnageOrCapacity}</span>
                              </div>
                              <h4 className="font-bold text-xs text-[#0F172A]">{p.name}</h4>
                              <p className="text-[11px] text-slate-500">{p.description}</p>
                              <a
                                href={generateWhatsAppLink(p)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] hover:underline pt-1"
                              >
                                <MessageCircle className="h-3 w-3" />
                                <span>Check price & stock for this model →</span>
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No exact catalogue model found. Ask our showroom desk directly.</p>
                      )}
                    </div>
                  )}

                  {/* Common Showroom Knowledge Topics */}
                  <div className="space-y-2.5 pt-1">
                    <p className="font-bold text-xs text-[#0F172A]">Frequent Showroom Questions:</p>

                    <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50 space-y-1">
                      <h4 className="font-bold text-xs text-[#0A3960]">3-Star vs 5-Star BEE Inverter AC:</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        A 5-Star inverter consumes approximately 20–25% less electricity compared to a 3-Star model under continuous summer usage (6+ hours daily), repaying the price difference over 2 seasons.
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50 space-y-1">
                      <h4 className="font-bold text-xs text-[#0A3960]">Why 100% Grooved Copper Coils Matter:</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        In coastal and delta regions like Konaseema, copper coils resist corrosion and chemical oxidation far better than aluminum alloys and allow easy repair soldering if required.
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50 space-y-1">
                      <h4 className="font-bold text-xs text-[#0A3960]">R-32 vs R-410A Refrigerant:</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        R-32 has a lower Global Warming Potential (GWP) and higher volumetric heat transfer efficiency, leading to faster cooling and reduced power draw.
                      </p>
                    </div>
                  </div>

                  <a
                    href={generateGeneralWhatsAppLink('Hi Vijaya Durga Refrigeration, I have a specific question regarding appliance models and specifications at your showroom.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-lg bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Ask Question to Showroom on WhatsApp</span>
                  </a>
                </div>
              )}

              {/* TAB 3: TECHNICIAN SPARE PARTS FINDER */}
              {activeTab === 'spares' && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-[#EBF3FA] border border-[#DCEAF5] p-3.5 space-y-1">
                    <p className="font-bold text-xs text-[#0A3960]">
                      HVAC Mechanic & Technician Desk
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Instant availability check for AC compressors, pure copper coils, refrigerant gas, and universal inverter PCB boards in Ravulapalem.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        name: '1.5 Ton Rotary Compressor (R32 / R410A)',
                        category: 'Compressors',
                        status: 'Available for Technician Inspection',
                      },
                      {
                        name: 'Pure Copper Piping Coils (1/4" & 1/2")',
                        category: 'Piping',
                        status: 'Rolls & Bundles in Stock',
                      },
                      {
                        name: 'Virgin R-32 Refrigerant Gas Cylinder',
                        category: 'Gas Cylinders',
                        status: 'Factory Sealed Cylinders',
                      },
                      {
                        name: 'Universal Inverter PCB Kit with Remote',
                        category: 'PCB Kits',
                        status: 'Tested at Counter',
                      },
                    ].map((spare, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-slate-200 rounded-lg bg-white flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-[#0284C7] uppercase">{spare.category}</span>
                          <p className="font-bold text-xs text-[#0F172A]">{spare.name}</p>
                          <span className="text-[10px] text-[#16A34A] font-semibold flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{spare.status}</span>
                          </span>
                        </div>

                        <a
                          href={generateGeneralWhatsAppLink(
                            `Hi Vijaya Durga Refrigeration, I am an AC technician inquiring about the availability and price of: ${spare.name}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-md bg-[#16A34A] text-white text-[11px] font-bold shrink-0 flex items-center gap-1"
                        >
                          <MessageCircle className="h-3 w-3" />
                          <span>Trade Price</span>
                        </a>
                      </div>
                    ))}
                  </div>

                  <a
                    href={generateGeneralWhatsAppLink(
                      'Hi Vijaya Durga Refrigeration, I am an AC repair mechanic looking for spare parts availability at your Ravulapalem trade desk.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-lg bg-[#0A3960] hover:bg-[#072A47] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Connect with Spares Trade Counter</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Bottom Footer Action Strip */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Vijaya Durga Refrigeration, Ravulapalem</span>
              <a
                href={VDR_BUSINESS_INFO.phoneCall}
                className="font-bold text-[#0A3960] hover:underline flex items-center gap-1"
              >
                <Phone className="h-3 w-3 text-[#0284C7]" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
