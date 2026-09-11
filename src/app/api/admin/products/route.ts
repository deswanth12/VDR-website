// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminProductsList } from '@/lib/db/queries';
import { db } from '@/lib/db';
import { products, productImages, productFeatures, productSpecs } from '@/lib/db/schema';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || undefined;
  const categoryId = searchParams.get('category') || undefined;
  const brandId = searchParams.get('brand') || undefined;

  const list = await getAdminProductsList(search, categoryId, brandId);
  return NextResponse.json({ products: list });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      brandId,
      categoryId,
      model,
      sku,
      slug,
      shortSummary,
      description,
      suitableFor,
      tonnageOrCapacity,
      starRating,
      coolingType,
      refrigerant,
      iseer,
      powerConsumption,
      inverterTech,
      coilMaterial,
      warranty,
      availability,
      enquiryMessage,
      isDemo,
      status,
      specificationStatus,
      isFeatured,
      isActive,
      images,
      features,
      specs,
    } = body;

    // Server-side validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }
    if (!brandId) {
      return NextResponse.json({ error: 'Brand selection is required.' }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: 'Category selection is required.' }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const now = new Date().toISOString();
    const productId = `prod_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // 1. Insert Product
    await db.insert(products).values({
      id: productId,
      slug: cleanSlug,
      name: name.trim(),
      brandId,
      categoryId,
      model: model ? model.trim() : null,
      sku: sku ? sku.trim() : null,
      shortSummary: shortSummary || '',
      description: description || null,
      suitableFor: suitableFor || null,
      tonnageOrCapacity: tonnageOrCapacity || null,
      starRating: starRating ? parseInt(starRating, 10) : null,
      coolingType: coolingType || null,
      refrigerant: refrigerant || null,
      iseer: iseer || null,
      powerConsumption: powerConsumption || null,
      inverterTech: inverterTech ? 1 : 0,
      coilMaterial: coilMaterial || null,
      warranty: warranty || null,
      availability: availability || null,
      enquiryMessage: enquiryMessage || null,
      isDemo: isDemo ? 1 : 0,
      status: status || 'Verified Product',
      specificationStatus: specificationStatus || 'Verified Spec',
      isFeatured: isFeatured ? 1 : 0,
      isActive: isActive !== undefined ? (isActive ? 1 : 0) : 1,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Insert Images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await db.insert(productImages).values({
          id: `${productId}_img_${i}_${crypto.randomBytes(2).toString('hex')}`,
          productId,
          url: typeof img === 'string' ? img : img.url,
          altText: typeof img === 'string' ? `${name} image` : img.altText || `${name} image`,
          isPrimary: i === 0 ? 1 : 0,
          sortOrder: i,
          createdAt: now,
        });
      }
    }

    // 3. Insert Features
    if (Array.isArray(features)) {
      for (let i = 0; i < features.length; i++) {
        const feat = features[i];
        if (feat && feat.trim()) {
          await db.insert(productFeatures).values({
            id: `${productId}_feat_${i}`,
            productId,
            featureText: feat.trim(),
            sortOrder: i,
          });
        }
      }
    }

    // 4. Insert Specs
    if (Array.isArray(specs)) {
      for (let i = 0; i < specs.length; i++) {
        const sp = specs[i];
        if (sp && sp.label && sp.value) {
          await db.insert(productSpecs).values({
            id: `${productId}_spec_${i}`,
            productId,
            specLabel: sp.label.trim(),
            specValue: sp.value.trim(),
            isKeySpec: sp.isKeySpec ? 1 : 0,
            sortOrder: i,
          });
        }
      }
    }

    // Revalidate public cache
    try {
      revalidatePath('/');
      revalidatePath('/catalogue');
      revalidatePath(`/products/${cleanSlug}`);
      revalidatePath('/compare');
    } catch (e) {
      console.error('Revalidation error:', e);
    }

    return NextResponse.json({ success: true, id: productId, slug: cleanSlug });
  } catch (err: any) {
    console.error('Failed to create product:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create product.' },
      { status: 500 }
    );
  }
}
