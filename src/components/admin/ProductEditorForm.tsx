// src/components/admin/ProductEditorForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Save,
  Check,
} from 'lucide-react';

interface ProductEditorFormProps {
  initialData?: any;
  productId?: string;
}

export default function ProductEditorForm({ initialData, productId }: ProductEditorFormProps) {
  const router = useRouter();
  const isEditing = Boolean(productId);

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [brandId, setBrandId] = useState(initialData?.brandId || 'daikin');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || 'split-ac');
  const [model, setModel] = useState(initialData?.model || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [shortSummary, setShortSummary] = useState(initialData?.shortSummary || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [suitableFor, setSuitableFor] = useState(initialData?.suitableFor || '');
  const [tonnageOrCapacity, setTonnageOrCapacity] = useState(initialData?.tonnageOrCapacity || '1.5 Ton');
  const [starRating, setStarRating] = useState<string>(
    initialData?.starRating !== undefined && initialData?.starRating !== null
      ? String(initialData.starRating)
      : '5'
  );
  const [coolingType, setCoolingType] = useState(initialData?.coolingType || 'Inverter Split Cooling');
  const [refrigerant, setRefrigerant] = useState(initialData?.refrigerant || 'R-32');
  const [iseer, setIseer] = useState(initialData?.iseer || '');
  const [powerConsumption, setPowerConsumption] = useState(initialData?.powerConsumption || '');
  const [coilMaterial, setCoilMaterial] = useState(initialData?.coilMaterial || '100% Pure Grooved Copper');
  const [warranty, setWarranty] = useState(
    initialData?.warranty || '1 Year Comprehensive + 10 Years Compressor Warranty'
  );
  const [availability, setAvailability] = useState(
    initialData?.availability || 'In Stock at Ravulapalem Showroom • Available for Immediate Delivery'
  );
  const [enquiryMessage, setEnquiryMessage] = useState(initialData?.enquiryMessage || '');
  const [isDemo, setIsDemo] = useState(initialData?.isDemo !== undefined ? Boolean(initialData.isDemo) : false);
  const [isFeatured, setIsFeatured] = useState(Boolean(initialData?.isFeatured));
  const [isActive, setIsActive] = useState(
    initialData?.isActive !== undefined ? Boolean(initialData.isActive) : true
  );

  // Features list
  const [features, setFeatures] = useState<string[]>(
    initialData?.features?.map((f: any) => (typeof f === 'string' ? f : f.featureText)) || [
      'Patented Inverter Energy Saving Compressor',
      '100% Grooved Copper Heat Exchanger Coils',
      'PM 2.5 Air Filtration with Dust Protection',
    ]
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  // Specs list
  const [specs, setSpecs] = useState<{ label: string; value: string; isKeySpec: boolean }[]>(
    initialData?.specs?.map((s: any) => ({
      label: s.specLabel,
      value: s.specValue,
      isKeySpec: Boolean(s.isKeySpec),
    })) || [
      { label: 'Cooling Capacity', value: '5000 Watts', isKeySpec: true },
      { label: 'Voltage Range', value: '160V – 265V Stabilizer Free', isKeySpec: false },
    ]
  );
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Images list
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((img: any) => (typeof img === 'string' ? img : img.url)) || [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Reference lists
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([fetch('/api/admin/categories'), fetch('/api/admin/brands')])
      .then(async ([catRes, brandRes]) => {
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        setCategoriesList(catData.categories || []);
        setBrandsList(brandData.brands || []);
      })
      .catch(console.error);
  }, []);

  // Auto-slugify product name if creating new
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    setSpecs([...specs, { label: newSpecLabel.trim(), value: newSpecValue.trim(), isKeySpec: false }]);
    setNewSpecLabel('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleToggleKeySpec = (idx: number) => {
    setSpecs(
      specs.map((s, i) => (i === idx ? { ...s, isKeySpec: !s.isKeySpec } : s))
    );
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSetPrimaryImage = (idx: number) => {
    if (idx === 0) return;
    const selected = images[idx];
    const remaining = images.filter((_, i) => i !== idx);
    setImages([selected, ...remaining]);
  };

  const handleMoveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setImages(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');

      setImages([...images, data.url]);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brandId,
        categoryId,
        model: model.trim() || null,
        sku: sku.trim() || null,
        shortSummary: shortSummary.trim() || name.trim(),
        description: description.trim() || null,
        suitableFor: suitableFor.trim() || null,
        tonnageOrCapacity: tonnageOrCapacity.trim() || null,
        starRating: starRating ? Number(starRating) : null,
        coolingType: coolingType.trim() || null,
        refrigerant: refrigerant.trim() || null,
        iseer: iseer.trim() || null,
        powerConsumption: powerConsumption.trim() || null,
        coilMaterial: coilMaterial.trim() || null,
        warranty: warranty.trim() || null,
        availability: availability.trim() || null,
        enquiryMessage: enquiryMessage.trim() || null,
        isDemo,
        status: isDemo ? 'Demo Preview' : 'Verified Product',
        specificationStatus: 'Verified Spec',
        isFeatured,
        isActive,
        images,
        features,
        specs,
      };

      const url = isEditing ? `/api/admin/products/${productId}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      setSuccess(`Product "${name}" saved successfully.`);
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* 1. TOP TITLE & STICKY SAVE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-[#0284C7] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Inventory</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading">
            {isEditing ? `Edit Product: ${initialData?.name || name}` : 'New Catalogue Item'}
          </h1>
          <p className="text-xs text-[#475569]">
            {isEditing
              ? 'Update specifications, media, and showroom availability.'
              : 'Add an appliance or spare part to the shared database.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <Link
              href={`/products/${slug}`}
              target="_blank"
              className="px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview</span>
            </Link>
          )}

          <Link
            href="/admin/products"
            className="px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-[#0A3960] hover:bg-[#072A47] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5 text-[#0284C7]" />
            <span>{loading ? 'Saving...' : 'Save Product'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* UNIFIED DOCUMENT CANVAS */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-10 shadow-xs">
        {/* SECTION 1: PRIMARY IDENTIFICATION */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] font-heading">
              1. Basic Information
            </h2>
            <p className="text-xs text-slate-500">Primary product naming and manufacturer categorisation.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Daikin 1.5 Ton 5-Star Inverter Split AC"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Manufacturer Brand</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full h-9 px-2.5 rounded-md border border-slate-300 text-xs text-[#0F172A] bg-white focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              >
                {brandsList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Catalogue Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-9 px-2.5 rounded-md border border-slate-300 text-xs text-[#0F172A] bg-white focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              >
                {categoriesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Model / Series Name</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. FTKM Series"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">SKU Reference</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. DAIKIN-FTKM50-DEMO"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A] font-mono focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. daikin-1-5-ton-5-star-inverter-split-ac"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-slate-600 font-mono bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: MARKETING & CONTENT */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] font-heading">
              2. Content & Key Features
            </h2>
            <p className="text-xs text-slate-500">Descriptions and selling points presented to showroom shoppers.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Short Summary (Catalogue card subtitle)</label>
              <textarea
                rows={2}
                value={shortSummary}
                onChange={(e) => setShortSummary(e.target.value)}
                placeholder="High-efficiency inverter split AC featuring rapid cooling and durable copper coils."
                className="w-full p-2.5 rounded-md border border-slate-300 text-xs text-[#0F172A] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Full Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed technical specifications and showroom background..."
                className="w-full p-2.5 rounded-md border border-slate-300 text-xs text-[#0F172A] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Suitable For (Room size / application)</label>
              <input
                type="text"
                value={suitableFor}
                onChange={(e) => setSuitableFor(e.target.value)}
                placeholder="e.g. Medium Bedrooms (120 - 160 sq.ft)"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              />
            </div>

            {/* Feature Bullets List Editor */}
            <div className="space-y-2 pt-2">
              <label className="font-semibold text-slate-700">Bullet Features</label>
              <div className="space-y-1.5">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-md">
                    <Check className="h-3.5 w-3.5 text-[#0284C7] shrink-0" />
                    <span className="flex-1 text-slate-800">{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="Type new feature and press Enter..."
                  className="flex-1 h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Add Feature
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: TECHNICAL SPECIFICATIONS */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] font-heading">
              3. Technical Specifications
            </h2>
            <p className="text-xs text-slate-500">Core engineering metrics and electrical specifications.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Tonnage / Capacity</label>
              <input
                type="text"
                value={tonnageOrCapacity}
                onChange={(e) => setTonnageOrCapacity(e.target.value)}
                placeholder="e.g. 1.5 Ton or 8.0 kg"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">BEE Star Rating</label>
              <select
                value={starRating}
                onChange={(e) => setStarRating(e.target.value)}
                className="w-full h-9 px-2.5 rounded-md border border-slate-300 text-xs text-[#0F172A] bg-white"
              >
                <option value="5">5 Star (Maximum Efficiency)</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star (Standard)</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
                <option value="">Not Applicable / Spares</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Cooling Technology</label>
              <input
                type="text"
                value={coolingType}
                onChange={(e) => setCoolingType(e.target.value)}
                placeholder="Inverter Split Cooling"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Refrigerant Gas</label>
              <input
                type="text"
                value={refrigerant}
                onChange={(e) => setRefrigerant(e.target.value)}
                placeholder="R-32"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ISEER Rating</label>
              <input
                type="text"
                value={iseer}
                onChange={(e) => setIseer(e.target.value)}
                placeholder="5.20"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Annual Power Consumption</label>
              <input
                type="text"
                value={powerConsumption}
                onChange={(e) => setPowerConsumption(e.target.value)}
                placeholder="785 kWh/year"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <label className="font-semibold text-slate-700">Coil & Condenser Material</label>
              <input
                type="text"
                value={coilMaterial}
                onChange={(e) => setCoilMaterial(e.target.value)}
                placeholder="100% Inner Grooved Copper"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-xs text-[#0F172A]"
              />
            </div>
          </div>

          {/* Additional Key-Value Specs */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Custom Specifications</label>
              <span className="text-[11px] text-slate-400">Click &quot;Key Spec&quot; to highlight on cards</span>
            </div>

            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-left text-xs text-[#0F172A]">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2 px-3">Specification Label</th>
                    <th className="py-2 px-3">Technical Value</th>
                    <th className="py-2 px-3 text-center">Highlight</th>
                    <th className="py-2 px-3 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {specs.map((sp, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-medium">{sp.label}</td>
                      <td className="py-2 px-3 text-slate-600">{sp.value}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleKeySpec(idx)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sp.isKeySpec
                              ? 'bg-blue-100 text-[#0A3960]'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {sp.isKeySpec ? 'Key Spec' : 'Standard'}
                        </button>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1 text-xs">
              <input
                type="text"
                placeholder="Spec Label (e.g. Noise Level)"
                value={newSpecLabel}
                onChange={(e) => setNewSpecLabel(e.target.value)}
                className="flex-1 h-8 px-3 rounded-md border border-slate-300"
              />
              <input
                type="text"
                placeholder="Spec Value (e.g. 32 dB Quiet)"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="flex-1 h-8 px-3 rounded-md border border-slate-300"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="h-8 px-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Add Spec
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: MEDIA & IMAGES */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] font-heading">
              4. Product Images
            </h2>
            <p className="text-xs text-slate-500">First image serves as the primary cover across the showroom catalogue.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          {/* Image Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((url, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group relative"
              >
                <img src={url} alt={`Preview ${idx}`} className="w-full h-28 object-cover" />
                <div className="p-2 bg-white flex items-center justify-between text-xs gap-1 border-t border-slate-100">
                  {idx === 0 ? (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className="text-[10px] text-[#0284C7] hover:underline font-semibold shrink-0"
                    >
                      Set Cover
                    </button>
                  )}

                  <div className="flex items-center gap-0.5">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, idx - 1)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500"
                        title="Move Left"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, idx + 1)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500"
                        title="Move Right"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                      title="Delete Image"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Image Controls */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Or paste direct image URL (https://...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 h-8 px-3 rounded-md border border-slate-300"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="h-8 px-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Add URL
              </button>
            </div>

            <label className="h-8 px-3 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="h-3.5 w-3.5 text-[#0284C7]" />
              <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* SECTION 5: COMMERCIAL STATUS & VISIBILITY */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] font-heading">
              5. Commercial Status & Visibility
            </h2>
            <p className="text-xs text-slate-500">Showroom availability, warranty statements, and publish states.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Showroom Availability Note</label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Official Warranty Statement</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-300"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Pre-filled WhatsApp Enquiry Message</label>
              <input
                type="text"
                value={enquiryMessage}
                onChange={(e) => setEnquiryMessage(e.target.value)}
                placeholder="Leave blank for automatic message generation"
                className="w-full h-9 px-3 rounded-md border border-slate-300"
              />
            </div>
          </div>

          {/* Visibility Checkboxes */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-6 text-xs font-semibold text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0A3960] focus:ring-[#0284C7]"
              />
              <span>Active in Public Catalogue</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0A3960] focus:ring-[#0284C7]"
              />
              <span>Feature on Showroom Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDemo}
                onChange={(e) => setIsDemo(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0A3960] focus:ring-[#0284C7]"
              />
              <span className="text-slate-500">Label as Demo Preview SKU</span>
            </label>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM SAVE BAR */}
      <div className="sticky bottom-4 z-20 bg-[#0A3960] text-white p-3.5 rounded-lg shadow-lg flex items-center justify-between gap-4">
        <span className="text-xs text-slate-300 hidden sm:inline">
          {name ? `Editing: ${name}` : 'Unsaved product document'}
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Link
            href="/admin/products"
            className="px-3 py-1.5 rounded text-xs text-slate-300 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{loading ? 'Saving...' : 'Save Product'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
