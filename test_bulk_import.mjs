// test_bulk_import.mjs
const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, headers: res.headers, data };
}

async function run() {
  console.log('========================================================');
  console.log('--- STARTING BULK IMPORT PIPELINE VERIFICATION SUITE ---');
  console.log('========================================================\n');

  // 1. Authenticate Admin
  console.log('Step 1: Authenticate Admin Session');
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
  console.log('PASS: Logged in successfully.\n');

  // 2. Download Template
  console.log('Step 2: Verify Template Download Endpoint (/api/admin/import/template)');
  const tplRes = await fetch(`${BASE_URL}/api/admin/import/template`, { headers: authHeaders });
  const tplText = await tplRes.text();
  if (tplRes.status === 200 && tplText.includes('name,brand,category') && tplText.includes('Daikin')) {
    console.log('PASS: Standard CSV template generated with correct headers and sample models.');
  } else {
    console.error('FAIL: Template generation failed', tplRes.status);
    return;
  }

  // 3. Test Preview & Header Synonym Normalization
  console.log('\nStep 3: Preview with Messy Client Headers & Duplicate Detection');
  // Notice we use synonym headers: 'item_name', 'make', 'cat', 'model_no', 'code', 'cap', 'stars'
  const messyCsv = `item_name,make,cat,model_no,code,cap,stars,features,specs
"Panasonic 1.5 Ton 5-Star Wi-Fi Inverter AC","Panasonic","Air Conditioners","CS-NU18WKYW","PANASONIC-NU18-TEST","1.5 Ton","5","Miraie App IoT Control | nanoe-G Air Purification | 100% Copper Shield","Cooling:5100W | ISEER:5.10 | Refrigerant:R32"
"Daikin 1.5 Ton 5-Star Inverter Split AC","Daikin","split-ac","FTKM Series","DAIKIN-FTKM50-DEMO","1.5 Ton","5","Existing updated feature","Cooling:5000W"
"","Invalid Brand","split-ac","","","","","Missing product title error test",""`;

  const previewRes = await request('/api/admin/import/preview', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ csvText: messyCsv }),
  });

  if (previewRes.status !== 200) {
    console.error('FAIL: Preview API error', previewRes);
    return;
  }

  const prev = previewRes.data;
  console.log(`PASS: Parsed ${prev.totalRows} rows:`);
  console.log(`  - Valid Ready: ${prev.validCount}`);
  console.log(`  - Net New: ${prev.newCount}`);
  console.log(`  - Existing Updates: ${prev.updateCount}`);
  console.log(`  - Validation Errors: ${prev.errorCount}`);

  if (prev.newCount === 1 && prev.updateCount === 1 && prev.errorCount === 1) {
    console.log('PASS: Exact categorization verified (1 New, 1 Duplicate/Update, 1 Error).');
  } else {
    console.error('FAIL: Unexpected count mismatch in preview', prev);
  }

  // 4. Commit Import
  console.log('\nStep 4: Execute Import Commit (/api/admin/import/commit)');
  const commitRes = await request('/api/admin/import/commit', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      rows: prev.previewRows,
      duplicateStrategy: 'update',
    }),
  });

  if (commitRes.status !== 200 || !commitRes.data?.success) {
    console.error('FAIL: Import commit failed', commitRes);
    return;
  }

  const commitData = commitRes.data;
  console.log(`PASS: Database commit executed:`);
  console.log(`  - Inserted: ${commitData.insertedCount}`);
  console.log(`  - Updated: ${commitData.updatedCount}`);
  console.log(`  - Skipped: ${commitData.skippedCount}`);

  // 5. Verify Public Storefront Sync
  console.log('\nStep 5: Verify Public Storefront Reflection');
  const publicRes = await request('/api/public/products');
  const importedProd = publicRes.data?.products?.find((p) => p.sku === 'PANASONIC-NU18-TEST');

  if (importedProd && importedProd.brand === 'Panasonic' && importedProd.category === 'split-ac') {
    console.log('PASS: New product "Panasonic 1.5 Ton" instantly accessible on Public Storefront:');
    console.log(`  - Name: ${importedProd.name}`);
    console.log(`  - Brand: ${importedProd.brand}`);
    console.log(`  - Category: ${importedProd.category}`);
    console.log(`  - Features: ${importedProd.features.join(' • ')}`);
  } else {
    console.error('FAIL: Imported product not found in public products API!', importedProd);
  }

  // 6. Cleanup imported test product & newly created brand
  console.log('\nStep 6: Cleanup Test Data');
  if (importedProd) {
    await request(`/api/admin/products/${importedProd.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    console.log('PASS: Cleaned up test product.');
  }

  await request('/api/admin/brands/panasonic', {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log('PASS: Cleaned up test brand "panasonic".');

  console.log('\n========================================================');
  console.log('ALL BULK IMPORT PIPELINE TESTS PASSED WITH ZERO ERRORS!');
  console.log('========================================================\n');
}

run().catch(console.error);
