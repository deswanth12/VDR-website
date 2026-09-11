// src/lib/db/seed.ts
import bcrypt from 'bcryptjs';
import { db } from './index';
import { initDatabase } from './init';
import {
  admins,
  categories,
  brands,
  products,
  productImages,
  productFeatures,
  productSpecs,
  businessInfo,
  homepageContent,
} from './schema';
import { eq } from 'drizzle-orm';
import { DEMO_PRODUCTS, CATEGORIES, VDR_BUSINESS_INFO } from '@/data/catalogue';

export async function seedDatabase() {
  await initDatabase();

  const now = new Date().toISOString();

  // 1. Seed Initial Admin
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@vijayadurgarefrigeration.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'VdrAdmin@2026!';

  const existingAdmin = await db.select().from(admins).where(eq(admins.email, adminEmail)).get();

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.insert(admins).values({
      id: 'admin_primary',
      email: adminEmail,
      passwordHash,
      name: 'VDR Operations Manager',
      role: 'superadmin',
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Initial admin created: ${adminEmail}`);
  }

  // 2. Seed Categories
  const realCategories = CATEGORIES.filter((c) => c.id !== 'all');
  for (let i = 0; i < realCategories.length; i++) {
    const cat = realCategories[i];
    const exists = await db.select().from(categories).where(eq(categories.id, cat.id)).get();
    if (!exists) {
      await db.insert(categories).values({
        id: cat.id,
        name: cat.name,
        slug: cat.id,
        description: `${cat.name} available at Vijaya Durga Refrigeration showroom, Ravulapalem.`,
        isActive: 1,
        sortOrder: i,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // 3. Seed Brands
  const initialBrands = [
    {
      id: 'daikin',
      name: 'Daikin',
      slug: 'daikin',
      tagline: 'High-Efficiency Inverter Air Conditioners with Grooved Copper Coils',
      description: 'Daikin air conditioning solutions available through Vijaya Durga Refrigeration showroom in Ravulapalem.',
      categoryTag: 'Air Conditioning Systems',
      highlights: [
        'Patented Swing Inverter Compressor Technology',
        '100% Grooved Pure Copper Condenser & Evaporator Coils',
        'PM 2.5 Particulate Filter & Anti-Microbial Protection',
        'Stabilizer-Free Operation Capability',
      ],
    },
    {
      id: 'lloyd',
      name: 'Lloyd',
      slug: 'lloyd',
      tagline: 'Rapid 52°C Ambient Cooling Inverter ACs with Golden Fin Protection',
      description: 'Lloyd air conditioners available through Vijaya Durga Refrigeration showroom in Ravulapalem.',
      categoryTag: 'Rapid Cooling Air Conditioners',
      highlights: [
        'Rapid Cooling Capacity Engineered for 52°C High Ambient Heat',
        'Golden Fin Anti-Corrosive Condenser Protection',
        '4-Way Motorized Air Circulation',
        'Clean Hidden Digital LED Temperature Display',
      ],
    },
    {
      id: 'mitsubishi-electric',
      name: 'Mitsubishi Electric',
      slug: 'mitsubishi-electric',
      tagline: 'Precision Engineered Heavy Inverter Air Conditioning Systems',
      description: 'Mitsubishi Electric air conditioning systems featured at Vijaya Durga Refrigeration showroom in Ravulapalem.',
      categoryTag: 'Heavy-Duty Inverter Cooling',
      highlights: [
        'Heavy-Duty Tropical Inverter Compressor for Relentless Summer Heat',
        'Ultra-Quiet Indoor Airflow Operation',
        'Dual Barrier Coating Filter',
        'Extended Distance Air Throw for Long Living Rooms',
      ],
    },
    {
      id: 'samsung',
      name: 'Samsung',
      slug: 'samsung',
      tagline: 'Digital Inverter Automatic Washing Machines with Gentle Fabric Care',
      description: 'Samsung home laundry appliances featured at Vijaya Durga Refrigeration showroom in Ravulapalem.',
      categoryTag: 'Automatic Washing Machines',
      highlights: [
        'Digital Inverter Motor with Low Noise & High Energy Efficiency',
        'Hygiene Steam Wash Cycle Eliminating 99.9% Bacteria',
        'Diamond Drum & Stainless Steel Pulsator',
        '5 Star BEE Energy Efficiency Rating',
      ],
    },
    {
      id: 'universal-oem',
      name: 'Universal Spares',
      slug: 'universal-oem',
      tagline: 'Genuine AC Replacement Parts & Refrigeration Materials',
      description: 'Dedicated trade counter for independent HVAC mechanics and repair workshops in Konaseema.',
      categoryTag: 'HVAC Replacement Spares',
      highlights: [
        'Rotary Compressors for 1.0T, 1.5T, and 2.0T Split ACs',
        'Deoxidized High-Phosphorus Pure Copper Tubes (1/4" to 5/8")',
        'Virgin Grade R-32 and R-410A Refrigerant Cylinders',
        'Universal Inverter PCB Boards with Wireless Remotes',
      ],
    },
  ];

  for (let i = 0; i < initialBrands.length; i++) {
    const b = initialBrands[i];
    const exists = await db.select().from(brands).where(eq(brands.id, b.id)).get();
    if (!exists) {
      await db.insert(brands).values({
        id: b.id,
        name: b.name,
        slug: b.slug,
        tagline: b.tagline,
        description: b.description,
        categoryTag: b.categoryTag,
        highlightsJson: JSON.stringify(b.highlights),
        isActive: 1,
        sortOrder: i,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // 4. Seed Products from DEMO_PRODUCTS
  for (let i = 0; i < DEMO_PRODUCTS.length; i++) {
    const p = DEMO_PRODUCTS[i];
    const exists = await db.select().from(products).where(eq(products.id, p.id)).get();

    // Map brand name to brand_id
    let brandId = 'universal-oem';
    if (p.brand.toLowerCase().includes('daikin')) brandId = 'daikin';
    else if (p.brand.toLowerCase().includes('lloyd')) brandId = 'lloyd';
    else if (p.brand.toLowerCase().includes('mitsubishi')) brandId = 'mitsubishi-electric';
    else if (p.brand.toLowerCase().includes('samsung')) brandId = 'samsung';

    if (!exists) {
      await db.insert(products).values({
        id: p.id,
        slug: p.slug,
        name: p.name,
        brandId,
        categoryId: p.category,
        model: p.model || '',
        sku: p.sku || '',
        shortSummary: p.shortSummary,
        description: p.description,
        suitableFor: p.suitableFor,
        tonnageOrCapacity: p.tonnageOrCapacity,
        starRating: p.starRating,
        coolingType: p.coolingType,
        refrigerant: p.refrigerant,
        iseer: p.iseer,
        powerConsumption: p.powerConsumption,
        inverterTech: p.inverterTech ? 1 : 0,
        coilMaterial: p.coilMaterial,
        warranty: p.warranty,
        availability: p.availability,
        enquiryMessage: p.enquiryMessage,
        isDemo: 1, // Explicitly tracked as demo
        status: p.status,
        specificationStatus: p.specificationStatus,
        isFeatured: i < 4 ? 1 : 0,
        isActive: 1,
        sortOrder: i,
        createdAt: now,
        updatedAt: now,
      });

      // Insert Images
      const allImages = p.images || [p.primaryImage || p.imageUrl];
      for (let imgIdx = 0; imgIdx < allImages.length; imgIdx++) {
        await db.insert(productImages).values({
          id: `${p.id}_img_${imgIdx}`,
          productId: p.id,
          url: allImages[imgIdx],
          altText: `${p.brand} ${p.name} photo ${imgIdx + 1}`,
          isPrimary: imgIdx === 0 ? 1 : 0,
          sortOrder: imgIdx,
          createdAt: now,
        });
      }

      // Insert Features
      if (p.features) {
        for (let featIdx = 0; featIdx < p.features.length; featIdx++) {
          await db.insert(productFeatures).values({
            id: `${p.id}_feat_${featIdx}`,
            productId: p.id,
            featureText: p.features[featIdx],
            sortOrder: featIdx,
          });
        }
      }

      // Insert Key Specs
      if (p.keySpecs) {
        for (let specIdx = 0; specIdx < p.keySpecs.length; specIdx++) {
          await db.insert(productSpecs).values({
            id: `${p.id}_keyspec_${specIdx}`,
            productId: p.id,
            specLabel: p.keySpecs[specIdx].label,
            specValue: p.keySpecs[specIdx].value,
            isKeySpec: 1,
            sortOrder: specIdx,
          });
        }
      }

      // Insert Detailed Specs
      if (p.detailedSpecs) {
        for (let specIdx = 0; specIdx < p.detailedSpecs.length; specIdx++) {
          const spec = p.detailedSpecs[specIdx];
          await db.insert(productSpecs).values({
            id: `${p.id}_detspec_${specIdx}`,
            productId: p.id,
            specLabel: spec.label,
            specValue: spec.value,
            isKeySpec: 0,
            sortOrder: specIdx + 10,
          });
        }
      }
    }
  }

  // 5. Seed Business Info
  const businessEntries: [string, string][] = [
    ['name', VDR_BUSINESS_INFO.name],
    ['popularName', VDR_BUSINESS_INFO.popularName],
    ['street', VDR_BUSINESS_INFO.street],
    ['landmark', VDR_BUSINESS_INFO.landmark],
    ['town', VDR_BUSINESS_INFO.town],
    ['district', VDR_BUSINESS_INFO.district],
    ['state', VDR_BUSINESS_INFO.state],
    ['pincode', VDR_BUSINESS_INFO.pincode],
    ['fullAddress', VDR_BUSINESS_INFO.fullAddress],
    ['googleMapsUrl', VDR_BUSINESS_INFO.googleMapsUrl],
    ['phoneDisplay', VDR_BUSINESS_INFO.phoneDisplay],
    ['phoneCall', VDR_BUSINESS_INFO.phoneCall],
    ['whatsappNumber', VDR_BUSINESS_INFO.whatsappNumber || ''],
    ['hours', VDR_BUSINESS_INFO.hours],
    ['hoursConfirmed', '0'],
  ];

  for (const [key, value] of businessEntries) {
    const exists = await db.select().from(businessInfo).where(eq(businessInfo.key, key)).get();
    if (!exists) {
      await db.insert(businessInfo).values({
        key,
        value,
        updatedAt: now,
      });
    }
  }

  // 6. Seed Homepage Content
  const heroContent = {
    locationPill: 'Market Road, Ravulapalem, Konaseema Dist, AP',
    headline: 'Air Conditioners, Home Appliances & Genuine AC Spares',
    supportingText:
      'Vijaya Durga Refrigeration is your trusted showroom on Market Road, Ravulapalem. We help families select energy-efficient cooling solutions and washing machines with truthful capacity guidance, while operating a dedicated trade counter supplying genuine replacement parts to local HVAC technicians.',
    primaryCtaText: 'Browse Products',
    secondaryCtaText: 'Enquire on WhatsApp',
    showroomCtaText: 'Visit Showroom',
  };

  const existingHero = await db
    .select()
    .from(homepageContent)
    .where(eq(homepageContent.sectionKey, 'hero'))
    .get();

  if (!existingHero) {
    await db.insert(homepageContent).values({
      sectionKey: 'hero',
      contentJson: JSON.stringify(heroContent),
      updatedAt: now,
    });
  }

  console.log('VDR database seeded successfully!');
}

// Auto-run if executed directly via node
if (process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.mjs')) {
  seedDatabase().catch((err) => {
    console.error('Failed to seed database:', err);
    process.exit(1);
  });
}
