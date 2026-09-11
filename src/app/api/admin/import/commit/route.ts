// src/app/api/admin/import/commit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  products,
  productImages,
  productFeatures,
  productSpecs,
  categories,
  brands,
} from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rows, duplicateStrategy = 'update' } = await req.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No rows provided for import.' }, { status: 400 });
    }

    // Load existing brand and category lookup maps
    const existingBrands = await db.select().from(brands).all();
    const brandMap = new Map<string, string>(); // lowercase name -> id
    for (const b of existingBrands) {
      brandMap.set(b.name.toLowerCase(), b.id);
      brandMap.set(b.slug.toLowerCase(), b.id);
    }

    const existingCategories = await db.select().from(categories).all();
    const categoryMap = new Map<string, string>(); // lowercase slug/id -> id
    for (const c of existingCategories) {
      categoryMap.set(c.id.toLowerCase(), c.id);
      categoryMap.set(c.slug.toLowerCase(), c.id);
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const now = new Date().toISOString();

    for (const row of rows) {
      if (row.errors && row.errors.length > 0) {
        skippedCount++;
        continue;
      }

      // 1. Resolve or Create Brand
      const brandRawName = (row.brand || 'General').trim();
      const brandKey = brandRawName.toLowerCase();
      let brandId = brandMap.get(brandKey) || '';

      if (!brandId) {
        brandId = brandRawName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        await db.insert(brands).values({
          id: brandId,
          name: brandRawName,
          slug: brandId,
          categoryTag: row.coolingType || 'Appliance Showroom Hub',
          tagline: `${brandRawName} Air Conditioners & Appliances`,
          description: `Authorized products and equipment from ${brandRawName}.`,
          isActive: 1,
          sortOrder: 10,
          createdAt: now,
          updatedAt: now,
        });

        brandMap.set(brandKey, brandId);
        brandMap.set(brandId, brandId);
      }

      // 2. Resolve or Create Category
      const catKey = (row.category || 'split-ac').toLowerCase();
      let categoryId = categoryMap.get(catKey) || '';

      if (!categoryId) {
        categoryId = catKey;
        await db.insert(categories).values({
          id: categoryId,
          name: row.category,
          slug: categoryId,
          description: `Products categorized under ${row.category}.`,
          isActive: 1,
          sortOrder: 10,
          createdAt: now,
          updatedAt: now,
        });

        categoryMap.set(catKey, categoryId);
      }

      const cleanSlug = row.slug.toLowerCase().trim();

      // 3. Check for existing product by SKU or Slug
      const existing = await db
        .select()
        .from(products)
        .where(
          row.sku
            ? or(eq(products.sku, row.sku), eq(products.slug, cleanSlug))
            : eq(products.slug, cleanSlug)
        )
        .get();

      let productId = existing?.id;

      if (existing) {
        if (duplicateStrategy === 'skip') {
          skippedCount++;
          continue;
        }

        // UPDATE EXISTING PRODUCT
        await db
          .update(products)
          .set({
            name: row.name,
            brandId,
            categoryId,
            model: row.model || null,
            sku: row.sku || null,
            shortSummary: row.shortSummary || row.name,
            description: row.description || null,
            suitableFor: row.suitableFor || null,
            tonnageOrCapacity: row.tonnageOrCapacity || null,
            starRating: row.starRating !== undefined ? Number(row.starRating) : null,
            coolingType: row.coolingType || null,
            refrigerant: row.refrigerant || null,
            iseer: row.iseer || null,
            powerConsumption: row.powerConsumption || null,
            coilMaterial: row.coilMaterial || null,
            warranty: row.warranty || null,
            availability: row.availability || null,
            isDemo: row.isDemo ? 1 : 0,
            status: row.isDemo ? 'Demo Preview' : 'Verified Product',
            specificationStatus: 'Verified Spec',
            updatedAt: now,
          })
          .where(eq(products.id, productId!));

        // Wipe old images, features, specs to cleanly refresh
        await db.delete(productImages).where(eq(productImages.productId, productId!));
        await db.delete(productFeatures).where(eq(productFeatures.productId, productId!));
        await db.delete(productSpecs).where(eq(productSpecs.productId, productId!));

        updatedCount++;
      } else {
        // INSERT NEW PRODUCT
        productId = `prod_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        await db.insert(products).values({
          id: productId,
          name: row.name,
          slug: cleanSlug,
          brandId,
          categoryId,
          model: row.model || null,
          sku: row.sku || null,
          shortSummary: row.shortSummary || row.name,
          description: row.description || null,
          suitableFor: row.suitableFor || null,
          tonnageOrCapacity: row.tonnageOrCapacity || null,
          starRating: row.starRating !== undefined ? Number(row.starRating) : null,
          coolingType: row.coolingType || null,
          refrigerant: row.refrigerant || null,
          iseer: row.iseer || null,
          powerConsumption: row.powerConsumption || null,
          coilMaterial: row.coilMaterial || null,
          warranty: row.warranty || null,
          availability: row.availability || null,
          enquiryMessage: `Hi Vijaya Durga Refrigeration, I am inquiring about ${row.name}.`,
          isDemo: row.isDemo ? 1 : 0,
          status: row.isDemo ? 'Demo Preview' : 'Verified Product',
          specificationStatus: 'Verified Spec',
          isFeatured: 0,
          isActive: 1,
          sortOrder: 0,
          createdAt: now,
          updatedAt: now,
        });

        insertedCount++;
      }

      // Insert Images
      const images = Array.isArray(row.images) && row.images.length > 0 ? row.images : [];
      for (let i = 0; i < images.length; i++) {
        const imgUrl = images[i];
        if (imgUrl && imgUrl.trim()) {
          await db.insert(productImages).values({
            id: `${productId!}_img_${i}`,
            productId: productId!,
            url: imgUrl.trim(),
            isPrimary: i === 0 ? 1 : 0,
            sortOrder: i,
            createdAt: now,
          });
        }
      }

      // Insert Features
      const features = Array.isArray(row.features) ? row.features : [];
      for (let i = 0; i < features.length; i++) {
        const feat = features[i];
        if (feat && feat.trim()) {
          await db.insert(productFeatures).values({
            id: `${productId!}_feat_${i}`,
            productId: productId!,
            featureText: feat.trim(),
            sortOrder: i,
          });
        }
      }

      // Insert Specs
      const specs = Array.isArray(row.specs) ? row.specs : [];
      for (let i = 0; i < specs.length; i++) {
        const sp = specs[i];
        if (sp && sp.label && sp.value) {
          await db.insert(productSpecs).values({
            id: `${productId!}_spec_${i}`,
            productId: productId!,
            specLabel: sp.label.trim(),
            specValue: sp.value.trim(),
            isKeySpec: sp.isKeySpec ? 1 : 0,
            sortOrder: i,
          });
        }
      }
    }

    // Trigger revalidation across public storefront
    try {
      revalidatePath('/');
      revalidatePath('/catalogue');
      revalidatePath('/compare');
    } catch (e) {
      console.error('Revalidation error on import:', e);
    }

    return NextResponse.json({
      success: true,
      insertedCount,
      updatedCount,
      skippedCount,
      totalProcessed: rows.length,
    });
  } catch (err: any) {
    console.error('Commit import error:', err);
    return NextResponse.json({ error: err.message || 'Failed to commit import.' }, { status: 500 });
  }
}
