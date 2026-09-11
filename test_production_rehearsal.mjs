// test_production_rehearsal.mjs
const BASE_URL = 'http://localhost:3005';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, headers: res.headers, data };
}

async function run() {
  console.log('===========================================================');
  console.log('--- STARTING PRODUCTION DEPLOYMENT REHEARSAL ---');
  console.log('===========================================================\n');

  // 1. Production Healthcheck
  console.log('Step 1: Production Standalone Health Check');
  const healthRes = await fetch(`${BASE_URL}/robots.txt`);
  if (healthRes.status === 200) {
    console.log('PASS: Next.js Standalone server is healthy and responding on port 3005.');
  } else {
    console.error('FAIL: Health check failed', healthRes.status);
    return;
  }

  // 2. Production Admin Authentication
  console.log('\nStep 2: Authenticate Admin on Production Standalone Server');
  const loginRes = await request('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@vijayadurgarefrigeration.com',
      password: 'VdrAdmin@2026!',
    }),
  });

  if (loginRes.status !== 200 || !loginRes.data?.success) {
    console.error('FAIL: Admin login failed', loginRes);
    return;
  }

  const setCookie = loginRes.headers.get('set-cookie');
  const sessionCookie = setCookie ? setCookie.split(';')[0] : '';
  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: sessionCookie,
  };
  console.log('PASS: Logged in as:', loginRes.data.admin.name);

  // 3. Create Product on Production Server
  console.log('\nStep 3: Create Persistent Product via Admin');
  const rehearsalProduct = {
    name: 'Rehearsal Daikin 1.5T 5-Star Split AC',
    slug: 'rehearsal-daikin-1-5t-5-star-split-ac',
    brandId: 'daikin',
    categoryId: 'split-ac',
    model: 'FTKM50-REHEARSAL',
    sku: 'DAIKIN-REHEARSAL-01',
    shortSummary: 'Production deployment rehearsal test model verifying persistent volume lifecycle.',
    description: 'This unit tests volume persistence across process shutdowns and container reboots.',
    suitableFor: 'Living Room (150 sq.ft)',
    tonnageOrCapacity: '1.5 Ton',
    starRating: '5',
    coolingType: 'Inverter Split Cooling',
    refrigerant: 'R-32',
    iseer: '5.20',
    powerConsumption: '780 kWh/year',
    coilMaterial: '100% Grooved Copper',
    warranty: '1 Year Comprehensive + 10 Years Compressor',
    availability: 'Showroom Stock',
    isDemo: false,
    status: 'Verified Product',
    specificationStatus: 'Verified Spec',
    isFeatured: true,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800'],
    features: ['Triple Display', 'Dew Clean Technology', 'Coanda Airflow'],
    specs: [
      { label: 'Cooling Capacity', value: '5280 Watts', isKeySpec: true },
      { label: 'Power Input', value: '1280 Watts', isKeySpec: true },
    ],
  };

  const createProdRes = await request('/api/admin/products', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(rehearsalProduct),
  });

  if (createProdRes.status !== 200 || !createProdRes.data?.id) {
    console.error('FAIL: Product creation failed', createProdRes);
    return;
  }
  const createdProdId = createProdRes.data.id;
  console.log(`PASS: Product created in SQLite database with ID: ${createdProdId}`);

  // 4. Submit Customer Enquiry to CRM
  console.log('\nStep 4: Submit Customer Lead / Enquiry');
  const enquiryRes = await request('/api/public/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Sita Rama Raju',
      phone: '9848022338',
      email: 'sitaram@example.com',
      productId: createdProdId,
      productName: rehearsalProduct.name,
      message: 'Need installation quotation in Ravulapalem for this Daikin unit.',
      enquiryType: 'purchase',
    }),
  });

  if (enquiryRes.status !== 200 || !enquiryRes.data?.success) {
    console.error('FAIL: Enquiry submission failed', enquiryRes);
    return;
  }
  console.log('PASS: Enquiry submitted and recorded into enquiries table.');

  // 5. Verify Public Storefront Reflection
  console.log('\nStep 5: Verify Public Storefront Sync');
  const publicRes = await request('/api/public/products');
  const foundInPublic = publicRes.data?.products?.find((p) => p.id === createdProdId);
  if (foundInPublic && foundInPublic.name === rehearsalProduct.name) {
    console.log('PASS: Product immediately rendered on public storefront API.');
  } else {
    console.error('FAIL: Product not visible in public catalogue', publicRes);
    return;
  }

  // 6. Create Point-in-Time Snapshot
  console.log('\nStep 6: Capture Pre-Reboot Snapshot');
  const snapshotRes = await request('/api/admin/backup', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ name: 'Rehearsal_Baseline_State' }),
  });

  if (snapshotRes.status !== 200 || !snapshotRes.data?.snapshot?.id) {
    console.error('FAIL: Snapshot creation failed', snapshotRes);
    return;
  }
  const snapshotId = snapshotRes.data.snapshot.id;
  console.log(`PASS: Snapshot captured: ${snapshotId} (${(snapshotRes.data.snapshot.sizeBytes / 1024).toFixed(1)} KB)`);

  console.log('\n-----------------------------------------------------------');
  console.log('PHASE 1 OF REHEARSAL COMPLETE: Data & Snapshot Created.');
  console.log('Next: Cold restart simulation and persistence verification.');
  console.log('-----------------------------------------------------------\n');

  return { createdProdId, snapshotId, authHeaders };
}

run()
  .then((res) => {
    if (res) {
      console.log('REHEARSAL_STATE:' + JSON.stringify(res));
    }
  })
  .catch(console.error);
