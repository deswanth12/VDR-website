// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminProductById, deleteProductById } from '@/lib/db/queries';
import { db } from '@/lib/db';
import { products, productImages, productFeatures, productSpecs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const product = await getAdminProductById(id);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

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

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const now = new Date().toISOString();

    // 1. Update Product Core
    await db
      .update(products)
      .set({
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
        updatedAt: now,
      })
      .where(eq(products.id, id));

    // 2. Replace Images if provided
    if (Array.isArray(images)) {
      await db.delete(productImages).where(eq(productImages.productId, id)).run();
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const url = typeof img === 'string' ? img : img.url;
        if (url) {
          await db.insert(productImages).values({
            id: `${id}_img_${i}_${crypto.randomBytes(2).toString('hex')}`,
            productId: id,
            url,
            altText: typeof img === 'string' ? `${name} image` : img.altText || `${name} image`,
            isPrimary: i === 0 ? 1 : 0,
            sortOrder: i,
            createdAt: now,
          });
        }
      }
    }

    // 3. Replace Features if provided
    if (Array.isArray(features)) {
      await db.delete(productFeatures).where(eq(productFeatures.productId, id)).run();
      for (let i = 0; i < features.length; i++) {
        const feat = features[i];
        if (feat && feat.trim()) {
          await db.insert(productFeatures).values({
            id: `${id}_feat_${i}`,
            productId: id,
            featureText: feat.trim(),
            sortOrder: i,
          });
        }
      }
    }

    // 4. Replace Specs if provided
    if (Array.isArray(specs)) {
      await db.delete(productSpecs).where(eq(productSpecs.productId, id)).run();
      for (let i = 0; i < specs.length; i++) {
        const sp = specs[i];
        if (sp && sp.label && sp.value) {
          await db.insert(productSpecs).values({
            id: `${id}_spec_${i}`,
            productId: id,
            specLabel: sp.label.trim(),
            specValue: sp.value.trim(),
            isKeySpec: sp.isKeySpec ? 1 : 0,
            sortOrder: i,
          });
        }
      }
    }

    try {
      revalidatePath('/');
      revalidatePath('/catalogue');
      revalidatePath(`/products/${cleanSlug}`);
      revalidatePath('/compare');
    } catch (e) {
      console.error('Revalidation error:', e);
    }

    return NextResponse.json({ success: true, id, slug: cleanSlug });
  } catch (err: any) {
    console.error('Failed to update product:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update product.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteProductById(id);

    try {
      revalidatePath('/');
      revalidatePath('/catalogue');
      revalidatePath('/compare');
    } catch (e) {
      console.error('Revalidation error:', e);
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err: any) {
    console.error('Failed to delete product:', err);
    return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
  }
}
