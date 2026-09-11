// src/app/api/admin/import/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { products, categories, brands } from '@/lib/db/schema';
import { parseCsv, normalizeRowHeaders } from '@/lib/import/csvParser';

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { csvText } = await req.json();

    if (!csvText || typeof csvText !== 'string' || !csvText.trim()) {
      return NextResponse.json({ error: 'CSV data is required.' }, { status: 400 });
    }

    const { headers, rows } = parseCsv(csvText);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file contains no data rows.' }, { status: 400 });
    }

    // Load existing database context
    const existingProducts = await db.select().from(products).all();
    const existingCategories = await db.select().from(categories).all();
    const existingBrands = await db.select().from(brands).all();

    const existingSkuMap = new Set(
      existingProducts.map((p) => p.sku?.toLowerCase()).filter(Boolean)
    );
    const existingSlugMap = new Set(existingProducts.map((p) => p.slug.toLowerCase()));

    const categorySlugMap = new Map(existingCategories.map((c) => [c.slug.toLowerCase(), c.id]));
    const categoryNameMap = new Map(existingCategories.map((c) => [c.name.toLowerCase(), c.id]));

    // Common category synonyms
    const resolveCategory = (rawCat: string) => {
      const trimmed = (rawCat || '').trim().toLowerCase();
      if (!trimmed) return 'split-ac';
      if (categorySlugMap.has(trimmed)) return categorySlugMap.get(trimmed)!;
      if (categoryNameMap.has(trimmed)) return categoryNameMap.get(trimmed)!;
      if (trimmed.includes('ac') || trimmed.includes('air') || trimmed.includes('condition'))
        return 'split-ac';
      if (trimmed.includes('wash') || trimmed.includes('machine')) return 'washing-machine';
      if (trimmed.includes('spare') || trimmed.includes('part') || trimmed.includes('compressor'))
        return 'ac-spares';
      return trimmed.replace(/[^a-z0-9]+/g, '-');
    };

    const previewRows = [];
    let validCount = 0;
    let errorCount = 0;
    let newCount = 0;
    let updateCount = 0;

    for (const r of rows) {
      const normalized = normalizeRowHeaders(r.data);
      const errors: string[] = [];

      // Validate required fields
      if (!normalized.name || !normalized.name.trim()) {
        errors.push('Product name is required.');
      }

      if (!normalized.brand || !normalized.brand.trim()) {
        errors.push('Brand name is required.');
      }

      const resolvedCategory = resolveCategory(normalized.category);

      const cleanSlug = (
        normalized.slug ||
        normalized.name ||
        `item-${r.lineNumber}`
      )
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const isExisting =
        (normalized.sku && existingSkuMap.has(normalized.sku.toLowerCase())) ||
        existingSlugMap.has(cleanSlug);

      if (errors.length > 0) {
        errorCount++;
      } else {
        validCount++;
        if (isExisting) {
          updateCount++;
        } else {
          newCount++;
        }
      }

      // Parse feature bullets
      const features = (normalized.features || '')
        .split(/[|;\n]/)
        .map((f) => f.trim())
        .filter(Boolean);

      // Parse specs: "Key:Value | Key:Value"
      const specs = (normalized.specs || '')
        .split(/[|;\n]/)
        .map((sp) => {
          const parts = sp.split(/[:=]/);
          if (parts.length >= 2) {
            return {
              label: parts[0].trim(),
              value: parts.slice(1).join(':').trim(),
              isKeySpec: true,
            };
          }
          return null;
        })
        .filter(Boolean);

      // Parse images
      const images = (normalized.images || '')
        .split(/[|,\n]/)
        .map((img) => img.trim())
        .filter(Boolean);

      previewRows.push({
        lineNumber: r.lineNumber,
        name: normalized.name || 'Untitled Product',
        brand: normalized.brand || 'General',
        category: resolvedCategory,
        model: normalized.model || '',
        sku: normalized.sku || '',
        slug: cleanSlug,
        shortSummary: normalized.shortSummary || '',
        description: normalized.description || '',
        tonnageOrCapacity: normalized.tonnageOrCapacity || '',
        starRating: normalized.starRating ? Number(normalized.starRating) : undefined,
        coolingType: normalized.coolingType || '',
        refrigerant: normalized.refrigerant || '',
        iseer: normalized.iseer || '',
        powerConsumption: normalized.powerConsumption || '',
        coilMaterial: normalized.coilMaterial || '',
        warranty: normalized.warranty || 'Subject to manufacturer confirmation',
        availability: normalized.availability || 'Contact showroom for availability',
        suitableFor: normalized.suitableFor || '',
        isDemo: normalized.isDemo === 'true' || normalized.isDemo === '1',
        features,
        specs,
        images:
          images.length > 0
            ? images
            : ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop'],
        status: errors.length > 0 ? 'error' : isExisting ? 'update' : 'new',
        errors,
      });
    }

    return NextResponse.json({
      success: true,
      headers,
      totalRows: rows.length,
      validCount,
      errorCount,
      newCount,
      updateCount,
      previewRows,
    });
  } catch (err: any) {
    console.error('Import preview error:', err);
    return NextResponse.json({ error: err.message || 'Failed to parse CSV preview.' }, { status: 500 });
  }
}
