// src/lib/db/queries.ts
import { db } from './index';
import {
  products,
  productImages,
  productFeatures,
  productSpecs,
  categories,
  brands,
  enquiries,
  businessInfo,
  homepageContent,
} from './schema';
import { eq, desc, asc, and, sql } from 'drizzle-orm';
import { ProductItem, ProductCategory, ProductSpec } from '@/data/catalogue';

// ==========================================
// 1. PUBLIC STOREFRONT QUERIES
// ==========================================

export async function getPublicProducts(): Promise<ProductItem[]> {
  try {
    const rawProducts = await db
      .select({
        product: products,
        brand: brands,
        category: categories,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, 1), eq(categories.isActive, 1)))
      .orderBy(asc(products.sortOrder), desc(products.createdAt))
      .all();

    if (!rawProducts || rawProducts.length === 0) return [];

    // Fetch images, features, specs for all active products
    const allImages = await db
      .select()
      .from(productImages)
      .orderBy(desc(productImages.isPrimary), asc(productImages.sortOrder))
      .all();

    const allFeatures = await db
      .select()
      .from(productFeatures)
      .orderBy(asc(productFeatures.sortOrder))
      .all();

    const allSpecs = await db
      .select()
      .from(productSpecs)
      .orderBy(asc(productSpecs.sortOrder))
      .all();

    return rawProducts.map(({ product, brand, category }) => {
      const pImages = allImages
        .filter((img) => img.productId === product.id)
        .map((img) => img.url);

      const pFeatures = allFeatures
        .filter((f) => f.productId === product.id)
        .map((f) => f.featureText);

      const pSpecs = allSpecs.filter((s) => s.productId === product.id);
      const keySpecs: ProductSpec[] = pSpecs
        .filter((s) => s.isKeySpec === 1)
        .map((s) => ({ label: s.specLabel, value: s.specValue }));

      const detailedSpecs: ProductSpec[] = pSpecs.map((s) => ({
        label: s.specLabel,
        value: s.specValue,
      }));

      const primaryImg =
        pImages[0] ||
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop';

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: (brand?.name as any) || 'Universal / OEM',
        model: product.model || '',
        sku: product.sku || '',
        category: product.categoryId as ProductCategory,
        categoryName: category?.name || product.categoryId,
        isDemo: product.isDemo === 1,
        status: (product.status as any) || 'Verified Product',
        specificationStatus: (product.specificationStatus as any) || 'Verified Spec',

        // Media
        images: pImages.length > 0 ? pImages : [primaryImg],
        primaryImage: primaryImg,
        additionalImages: pImages.slice(1),
        imageUrl: primaryImg,

        // Descriptive
        description: product.description || product.shortSummary || '',
        shortSummary: product.shortSummary || '',
        features: pFeatures,
        tags: [brand?.name || '', product.categoryId].filter(Boolean),
        suitableFor: product.suitableFor || undefined,

        // Technical Facets
        tonnageOrCapacity: product.tonnageOrCapacity || undefined,
        starRating: product.starRating || undefined,
        coolingType: (product.coolingType as any) || undefined,
        refrigerant: product.refrigerant || undefined,
        iseer: product.iseer || undefined,
        powerConsumption: product.powerConsumption || undefined,
        inverterTech: product.inverterTech === 1,
        coilMaterial: (product.coilMaterial as any) || undefined,

        // Specifications
        specifications: detailedSpecs,
        keySpecs,
        detailedSpecs,

        // Commercial & Showroom Status
        warranty: product.warranty || 'Subject to manufacturer confirmation',
        warrantyDisclaimer: product.warranty || 'Subject to manufacturer confirmation',
        availability: product.availability || 'Contact showroom for current availability',
        showroomAvailabilityNote: product.availability || 'Contact showroom for current availability',
        enquiryMessage: product.enquiryMessage || '',

        // Timestamps
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });
  } catch (err) {
    console.error('Error fetching public products from database:', err);
    return [];
  }
}

export async function getPublicProductBySlug(slug: string): Promise<ProductItem | null> {
  const all = await getPublicProducts();
  return all.find((p) => p.slug === slug) || null;
}

export async function getPublicCategories() {
  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, 1))
    .orderBy(asc(categories.sortOrder))
    .all();
}

export async function getPublicBrands() {
  return db
    .select()
    .from(brands)
    .where(eq(brands.isActive, 1))
    .orderBy(asc(brands.sortOrder))
    .all();
}

export async function getPublicBusinessInfo(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(businessInfo).all();
    const map: Record<string, string> = {};
    for (const r of rows) {
      map[r.key] = r.value;
    }
    return map;
  } catch (err) {
    console.error('Error fetching business info:', err);
    return {};
  }
}

export async function getPublicHomepageContent(section = 'hero') {
  try {
    const row = await db
      .select()
      .from(homepageContent)
      .where(eq(homepageContent.sectionKey, section))
      .get();
    if (!row) return null;
    return JSON.parse(row.contentJson);
  } catch {
    return null;
  }
}

// ==========================================
// 2. ADMIN DASHBOARD & CRUD QUERIES
// ==========================================

export async function getAdminDashboardMetrics() {
  const totalProducts = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .get();

  const activeProducts = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.isActive, 1))
    .get();

  const totalCategories = await db
    .select({ count: sql<number>`count(*)` })
    .from(categories)
    .get();

  const totalBrands = await db
    .select({ count: sql<number>`count(*)` })
    .from(brands)
    .get();

  const totalEnquiries = await db
    .select({ count: sql<number>`count(*)` })
    .from(enquiries)
    .get();

  const newEnquiries = await db
    .select({ count: sql<number>`count(*)` })
    .from(enquiries)
    .where(eq(enquiries.status, 'new'))
    .get();

  const recentEnquiries = await db
    .select()
    .from(enquiries)
    .orderBy(desc(enquiries.createdAt))
    .limit(5)
    .all();

  const recentProducts = await db
    .select({
      product: products,
      brand: brands,
      category: categories,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt))
    .limit(5)
    .all();

  return {
    totalProducts: totalProducts?.count || 0,
    activeProducts: activeProducts?.count || 0,
    totalCategories: totalCategories?.count || 0,
    totalBrands: totalBrands?.count || 0,
    totalEnquiries: totalEnquiries?.count || 0,
    newEnquiries: newEnquiries?.count || 0,
    recentEnquiries,
    recentProducts,
  };
}

// ADMIN PRODUCTS
export async function getAdminProductsList(search?: string, categoryId?: string, brandId?: string) {
  const query = db
    .select({
      product: products,
      brand: brands,
      category: categories,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt));

  const allRows = await query.all();

  let filtered = allRows;
  if (categoryId && categoryId !== 'all') {
    filtered = filtered.filter((r) => r.product.categoryId === categoryId);
  }
  if (brandId && brandId !== 'all') {
    filtered = filtered.filter((r) => r.product.brandId === brandId);
  }
  if (search && search.trim() !== '') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.product.name.toLowerCase().includes(q) ||
        (r.product.model && r.product.model.toLowerCase().includes(q)) ||
        (r.product.sku && r.product.sku.toLowerCase().includes(q)) ||
        (r.brand && r.brand.name.toLowerCase().includes(q))
    );
  }

  // Get image count and primary image
  const images = await db.select().from(productImages).all();

  return filtered.map(({ product, brand, category }) => {
    const pImgs = images.filter((img) => img.productId === product.id);
    const primaryImg = pImgs.find((img) => img.isPrimary === 1) || pImgs[0];

    return {
      ...product,
      brandName: brand?.name || 'Unknown',
      categoryName: category?.name || 'Unknown',
      imageCount: pImgs.length,
      primaryImageUrl: primaryImg?.url || '',
    };
  });
}

export async function getAdminProductById(id: string) {
  const product = await db.select().from(products).where(eq(products.id, id)).get();
  if (!product) return null;

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(desc(productImages.isPrimary), asc(productImages.sortOrder))
    .all();

  const features = await db
    .select()
    .from(productFeatures)
    .where(eq(productFeatures.productId, id))
    .orderBy(asc(productFeatures.sortOrder))
    .all();

  const specs = await db
    .select()
    .from(productSpecs)
    .where(eq(productSpecs.productId, id))
    .orderBy(asc(productSpecs.sortOrder))
    .all();

  return {
    ...product,
    images,
    features,
    specs,
  };
}

export async function deleteProductById(id: string) {
  // Cascading deletes handled by foreign key or manual clean-up
  await db.delete(productImages).where(eq(productImages.productId, id)).run();
  await db.delete(productFeatures).where(eq(productFeatures.productId, id)).run();
  await db.delete(productSpecs).where(eq(productSpecs.productId, id)).run();
  return db.delete(products).where(eq(products.id, id)).run();
}

// ADMIN CATEGORIES
export async function getAdminCategoriesList() {
  const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder)).all();
  const prods = await db.select().from(products).all();

  return cats.map((cat) => ({
    ...cat,
    productCount: prods.filter((p) => p.categoryId === cat.id).length,
  }));
}

// ADMIN BRANDS
export async function getAdminBrandsList() {
  const brs = await db.select().from(brands).orderBy(asc(brands.sortOrder)).all();
  const prods = await db.select().from(products).all();

  return brs.map((b) => ({
    ...b,
    productCount: prods.filter((p) => p.brandId === b.id).length,
    highlights: b.highlightsJson ? JSON.parse(b.highlightsJson) : [],
  }));
}

// ADMIN ENQUIRIES
export async function getAdminEnquiriesList(status?: string, search?: string) {
  const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).all();
  let filtered = rows;
  if (status && status !== 'all') {
    filtered = filtered.filter((e) => e.status === status);
  }
  if (search && search.trim() !== '') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.customerName.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        (e.productName && e.productName.toLowerCase().includes(q)) ||
        (e.message && e.message.toLowerCase().includes(q))
    );
  }
  return filtered;
}

export async function createPublicEnquiry(data: {
  customerName: string;
  phone: string;
  whatsappNumber?: string;
  productId?: string;
  productName?: string;
  inquiryType?: string;
  message?: string;
  source?: string;
}) {
  const now = new Date().toISOString();
  const id = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return db.insert(enquiries).values({
    id,
    customerName: data.customerName,
    phone: data.phone,
    whatsappNumber: data.whatsappNumber || data.phone,
    productId: data.productId || null,
    productName: data.productName || null,
    inquiryType: data.inquiryType || 'General',
    message: data.message || '',
    source: data.source || 'website',
    status: 'new',
    createdAt: now,
    updatedAt: now,
  });
}
