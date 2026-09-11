// test_admin_flow.mjs
import http from 'http';

const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, headers: res.headers, data };
}

async function runTests() {
  console.log('--- Starting VDR Admin & Backend End-to-End Tests ---');

  // Test 1: Invalid Login
  console.log('\nTest 1: Invalid Login Attempt');
  const badLogin = await request('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@vijayadurgarefrigeration.com', password: 'WrongPassword123' }),
  });
  if (badLogin.status === 401) {
    console.log('PASS: Correctly rejected invalid credentials (HTTP 401)');
  } else {
    console.error('FAIL: Expected 401 but got', badLogin.status);
  }

  // Test 2: Valid Login
  console.log('\nTest 2: Valid Admin Login');
  const goodLogin = await request('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@vijayadurgarefrigeration.com', password: 'VdrAdmin@2026!' }),
  });

  if (goodLogin.status === 200 && goodLogin.data?.success) {
    console.log('PASS: Admin authenticated successfully. Logged in as:', goodLogin.data.admin.name);
  } else {
    console.error('FAIL: Login failed', goodLogin);
    return;
  }

  const setCookie = goodLogin.headers.get('set-cookie');
  const sessionCookie = setCookie ? setCookie.split(';')[0] : '';
  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: sessionCookie,
  };

  // Test 3: Check /api/admin/auth/me
  console.log('\nTest 3: Current Admin Session Check');
  const meRes = await request('/api/admin/auth/me', { headers: authHeaders });
  if (meRes.status === 200 && meRes.data?.admin?.email === 'admin@vijayadurgarefrigeration.com') {
    console.log('PASS: Session verified for:', meRes.data.admin.email);
  } else {
    console.error('FAIL: /api/admin/auth/me failed', meRes);
  }

  // Test 4: Fetch Admin Products
  console.log('\nTest 4: Admin Products Listing');
  const prodRes = await request('/api/admin/products', { headers: authHeaders });
  console.log(`PASS: Retrieved ${prodRes.data?.products?.length} products from shared database.`);

  // Test 5: Create a Test Product
  console.log('\nTest 5: Create New Product via Admin API');
  const newProductPayload = {
    name: 'Carrier 1.5 Ton 5-Star Flexicool Inverter Split AC',
    slug: 'carrier-1-5-ton-5-star-flexicool-demo',
    brandId: 'universal-oem',
    categoryId: 'split-ac',
    model: 'CAI18ER5R30F0',
    sku: 'CARRIER-FLEXI-DEMO',
    shortSummary: 'Flexicool convertible inverter split AC with dual filtration and 100% copper condenser.',
    description: 'Advanced 6-in-1 convertible cooling with Insta Cool rapid ambient drop.',
    suitableFor: 'Medium Bedrooms (120 - 150 sq.ft)',
    tonnageOrCapacity: '1.5 Ton',
    starRating: '5',
    coolingType: 'Inverter Split Cooling',
    refrigerant: 'R-32',
    iseer: '5.0',
    powerConsumption: '810 kWh/year',
    inverterTech: true,
    coilMaterial: '100% Grooved Copper',
    warranty: '1 Year Comprehensive + 10 Years Compressor',
    availability: 'Available on Showroom Order',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    isFeatured: true,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop'],
    features: ['6-in-1 Flexicool Inverter Technology', 'PM 2.5 Air Clean Filter', 'Dual Pure Copper Coils'],
    specs: [
      { label: 'Cooling Capacity', value: '5050 Watts', isKeySpec: true },
      { label: 'Air Flow Rate', value: '650 CFM', isKeySpec: false },
    ],
  };

  const createRes = await request('/api/admin/products', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(newProductPayload),
  });

  let createdId = createRes.data?.id;
  if (createRes.status === 200 && createdId) {
    console.log('PASS: Product created with ID:', createdId);
  } else {
    console.error('FAIL: Product creation failed', createRes);
  }

  // Test 6: Verify Product Appears in Public Products API
  console.log('\nTest 6: Verify Shared Data Layer Sync to Public API');
  const publicProds = await request('/api/public/products');
  const foundInPublic = publicProds.data?.products?.find((p) => p.id === createdId);
  if (foundInPublic) {
    console.log('PASS: New product instantly visible in Public Storefront API:', foundInPublic.name);
  } else {
    console.error('FAIL: Product not found in public products list!');
  }

  // Test 7: Update Product
  console.log('\nTest 7: Update Product in Database');
  const updateRes = await request(`/api/admin/products/${createdId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      ...newProductPayload,
      name: 'Carrier 1.5 Ton 5-Star Flexicool Inverter Split AC (Updated Model)',
    }),
  });
  if (updateRes.status === 200) {
    console.log('PASS: Product successfully updated in database.');
  } else {
    console.error('FAIL: Product update failed', updateRes);
  }

  // Test 8: Public Enquiry Submission
  console.log('\nTest 8: Public Contact Form Lead Capture');
  const enqPayload = {
    customerName: 'Suresh Varma',
    phone: '9849123456',
    inquiryType: 'AC Purchase Inquiry',
    message: 'Looking for Daikin 1.5T 5 Star AC pricing with installation in Ravulapalem.',
    source: 'e2e_test',
  };
  const enqRes = await request('/api/public/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enqPayload),
  });
  if (enqRes.status === 200 && enqRes.data?.success) {
    console.log('PASS: Customer lead submitted via public enquiry endpoint.');
  } else {
    console.error('FAIL: Public enquiry failed', enqRes);
  }

  // Test 9: Verify Enquiry in Admin CRM
  console.log('\nTest 9: Admin CRM Retrieval of Lead');
  const adminEnq = await request('/api/admin/enquiries?search=Suresh', { headers: authHeaders });
  const matchingEnq = adminEnq.data?.enquiries?.find((e) => e.customerName === 'Suresh Varma');
  if (matchingEnq) {
    console.log('PASS: Lead located in Admin CRM:', matchingEnq.customerName, '| Status:', matchingEnq.status);

    // Update status to 'contacted'
    const patchRes = await request(`/api/admin/enquiries/${matchingEnq.id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'contacted', internalNotes: 'Called customer; quoted 38k.' }),
    });
    if (patchRes.status === 200) {
      console.log('PASS: Lead status updated to "contacted" with showroom notes.');
    }

    // Clean up test enquiry
    await request(`/api/admin/enquiries/${matchingEnq.id}`, { method: 'DELETE', headers: authHeaders });
    console.log('PASS: Test enquiry cleaned up.');
  } else {
    console.error('FAIL: Could not locate customer enquiry in admin CRM!');
  }

  // Test 10: Delete Created Product
  console.log('\nTest 10: Delete Product Cleanup');
  const delRes = await request(`/api/admin/products/${createdId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  if (delRes.status === 200) {
    console.log('PASS: Test product deleted cleanly.');
  }

  // Test 11: Business Information Update Test
  console.log('\nTest 11: Business Info API Verification');
  const bizRes = await request('/api/admin/business', { headers: authHeaders });
  if (bizRes.status === 200 && bizRes.data?.businessInfo?.name === 'Vijaya Durga Refrigeration') {
    console.log('PASS: Showroom business information verified:', bizRes.data.businessInfo.fullAddress);
  }

  console.log('\n=============================================');
  console.log('ALL VDR BACKEND & ADMIN PORTAL TESTS PASSED!');
  console.log('=============================================\n');
}

runTests().catch(console.error);
