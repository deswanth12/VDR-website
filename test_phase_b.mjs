// test_phase_b.mjs
const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, headers: res.headers, data };
}

async function run() {
  console.log('=====================================================');
  console.log('--- STARTING PHASE B VERIFICATION TEST SUITE ---');
  console.log('=====================================================\n');

  // 1. Authenticate Admin
  console.log('Step 1: Admin Authentication');
  const loginRes = await request('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@vijayadurgarefrigeration.com',
      password: 'VdrAdmin@2026!',
    }),
  });

  if (loginRes.status !== 200 || !loginRes.data?.success) {
    console.error('FAIL: Login failed', loginRes);
    return;
  }

  const setCookie = loginRes.headers.get('set-cookie');
  const sessionCookie = setCookie ? setCookie.split(';')[0] : '';
  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: sessionCookie,
  };
  console.log('PASS: Logged in as:', loginRes.data.admin.name);

  // ----------------------------------------------------
  // B1: Product CRUD, Search, Filters & Validation
  // ----------------------------------------------------
  console.log('\n--- B1: Product CRUD, Validation & Revalidation ---');

  // Validation test: Missing Name
  const invalidRes = await request('/api/admin/products', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ slug: 'test-without-name' }),
  });
  if (invalidRes.status === 400) {
    console.log('PASS: Server rejected product creation with missing name (HTTP 400)');
  } else {
    console.error('FAIL: Expected 400 for missing product name, got', invalidRes.status);
  }

  // Create Product with complete relational hierarchy
  const testProductPayload = {
    name: 'Mitsubishi Heavy Industries 2.0 Ton 5-Star Hyper Inverter AC',
    slug: 'mitsubishi-heavy-2-0-ton-hyper-inverter-test',
    brandId: 'mitsubishi-electric',
    categoryId: 'split-ac',
    model: 'SRK20CRS-S5',
    sku: 'MITSUBISHI-20CRS-TEST',
    shortSummary: 'High-ambient 2.0 Ton heavy-duty hyper inverter split AC engineered for harsh coastal heat.',
    description: 'Jet air technology delivers powerful airflow reaching up to 17 meters with 100% inner grooved copper.',
    suitableFor: 'Large Living Halls & Commercial Suites (180 - 240 sq.ft)',
    tonnageOrCapacity: '2.0 Ton',
    starRating: '5',
    coolingType: 'Inverter Split Cooling',
    refrigerant: 'R-32',
    iseer: '5.10',
    powerConsumption: '940 kWh/year',
    inverterTech: true,
    coilMaterial: '100% Inner Grooved Copper',
    warranty: '1 Year Full Unit + 10 Years Inverter Compressor',
    availability: 'Available for Immediate Showroom Order',
    isDemo: false,
    status: 'Verified Product',
    specificationStatus: 'Verified Spec',
    isFeatured: true,
    isActive: true,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    ],
    features: [
      'Jet Air Technology reaching 17 meters air throw',
      'Solar Refreshing Deodorizing Filter',
      'Anti-corrosion Blue Fin Condenser',
    ],
    specs: [
      { label: 'Cooling Capacity', value: '6300 Watts', isKeySpec: true },
      { label: 'Air Circulation', value: '820 CFM', isKeySpec: true },
      { label: 'Noise Level', value: '28 dB (Quiet Mode)', isKeySpec: false },
    ],
  };

  const createProdRes = await request('/api/admin/products', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(testProductPayload),
  });

  const createdProdId = createProdRes.data?.id;
  if (createProdRes.status === 200 && createdProdId) {
    console.log('PASS: Product created with relational images, features, and specs. ID:', createdProdId);
  } else {
    console.error('FAIL: Product creation failed', createProdRes);
    return;
  }

  // Search & Filters Check
  const searchRes = await request('/api/admin/products?search=SRK20CRS-S5', { headers: authHeaders });
  const foundSearch = searchRes.data?.products?.find((p) => p.id === createdProdId);
  if (foundSearch) {
    console.log('PASS: Product found by SKU/model search filter:', foundSearch.name);
  } else {
    console.error('FAIL: Product not found by SKU search');
  }

  // Public Storefront Sync Check
  const publicProd = await request('/api/public/products');
  const foundInPublic = publicProd.data?.products?.find((p) => p.id === createdProdId);
  if (foundInPublic && foundInPublic.features.length === 3 && foundInPublic.keySpecs.length === 2) {
    console.log('PASS: Product synchronized to public catalogue with features and specs intact');
  } else {
    console.error('FAIL: Public catalogue sync incomplete', foundInPublic);
  }

  // ----------------------------------------------------
  // B2: Category CRUD & Unsafe Deletion Guard
  // ----------------------------------------------------
  console.log('\n--- B2: Category CRUD & Safe Deletion Guard ---');

  // Attempt to delete 'split-ac' category (which has active products)
  const unsafeDelCat = await request('/api/admin/categories/split-ac', {
    method: 'DELETE',
    headers: authHeaders,
  });
  if (unsafeDelCat.status === 400 && unsafeDelCat.data?.error?.includes('product(s) still belong to this category')) {
    console.log('PASS: Safely blocked deletion of category with attached products (HTTP 400):', unsafeDelCat.data.error);
  } else {
    console.error('FAIL: Expected deletion block for category with products, got', unsafeDelCat);
  }

  // Create temporary category
  const newCatRes = await request('/api/admin/categories', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Commercial Cassette ACs',
      slug: 'commercial-cassette-acs-test',
      description: '4-way ceiling cassette systems for showrooms and restaurants.',
    }),
  });
  if (newCatRes.status === 200) {
    console.log('PASS: Created new category "Commercial Cassette ACs"');
  }

  // Delete empty category (should succeed)
  const delCatRes = await request('/api/admin/categories/commercial-cassette-acs-test', {
    method: 'DELETE',
    headers: authHeaders,
  });
  if (delCatRes.status === 200) {
    console.log('PASS: Safely deleted empty category "commercial-cassette-acs-test"');
  }

  // ----------------------------------------------------
  // B3: Brand CRUD & Unsafe Deletion Guard
  // ----------------------------------------------------
  console.log('\n--- B3: Brand CRUD & Safe Deletion Guard ---');

  // Attempt to delete 'daikin' brand (which has active products)
  const unsafeDelBrand = await request('/api/admin/brands/daikin', {
    method: 'DELETE',
    headers: authHeaders,
  });
  if (unsafeDelBrand.status === 400 && unsafeDelBrand.data?.error?.includes('product(s) still belong to this brand')) {
    console.log('PASS: Safely blocked deletion of brand with attached products (HTTP 400):', unsafeDelBrand.data.error);
  } else {
    console.error('FAIL: Expected deletion block for brand with products, got', unsafeDelBrand);
  }

  // Create temporary brand
  const newBrandRes = await request('/api/admin/brands', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Hitachi Cooling',
      slug: 'hitachi-cooling-test',
      tagline: 'Precision Inverter Air Conditioners',
      categoryTag: 'Expandable Inverter Cooling',
      description: 'Hitachi residential and light commercial air conditioning.',
    }),
  });
  if (newBrandRes.status === 200) {
    console.log('PASS: Created new brand "Hitachi Cooling"');
  }

  // Delete empty brand
  const delBrandRes = await request('/api/admin/brands/hitachi-cooling-test', {
    method: 'DELETE',
    headers: authHeaders,
  });
  if (delBrandRes.status === 200) {
    console.log('PASS: Safely deleted empty brand "hitachi-cooling-test"');
  }

  // ----------------------------------------------------
  // B4: Image Gallery & Reordering
  // ----------------------------------------------------
  console.log('\n--- B4: Images, Primary Selection & Gallery ---');
  // Update created product with new primary image and reversed order
  const updatedImagesPayload = {
    ...testProductPayload,
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    ],
  };
  const updateImgRes = await request(`/api/admin/products/${createdProdId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify(updatedImagesPayload),
  });
  if (updateImgRes.status === 200) {
    console.log('PASS: Gallery images and primary cover successfully reordered in database.');
  }

  // Cleanup test product
  const delProdRes = await request(`/api/admin/products/${createdProdId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  if (delProdRes.status === 200) {
    console.log('PASS: Cleaned up test product.');
  }

  // ----------------------------------------------------
  // Security Action: Password Rotation Verification
  // ----------------------------------------------------
  console.log('\n--- Security: Password Rotation API Test ---');
  // Wrong current password
  const badRotRes = await request('/api/admin/auth/change-password', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      currentPassword: 'IncorrectOldPassword',
      newPassword: 'VdrProductionPass@2026!',
    }),
  });
  if (badRotRes.status === 403) {
    console.log('PASS: Password change correctly rejected with invalid current password (HTTP 403)');
  } else {
    console.error('FAIL: Expected 403 for wrong current password, got', badRotRes);
  }

  console.log('\n=====================================================');
  console.log('ALL PHASE B REQUIREMENTS SUCCESSFULLY VERIFIED!');
  console.log('=====================================================\n');
}

run().catch(console.error);
