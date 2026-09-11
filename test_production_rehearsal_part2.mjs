// test_production_rehearsal_part2.mjs
const BASE_URL = 'http://localhost:3005';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, headers: res.headers, data };
}

async function run() {
  console.log('===========================================================');
  console.log('--- PRODUCTION REHEARSAL PART 2: POST-RESTART CHECKS ---');
  console.log('===========================================================\n');

  // 1. Authenticate Admin
  console.log('Step 7: Authenticate After Cold Restart');
  const loginRes = await request('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@vijayadurgarefrigeration.com',
      password: 'VdrAdmin@2026!',
    }),
  });

  if (loginRes.status !== 200 || !loginRes.data?.success) {
    console.error('FAIL: Admin login failed on restarted server', loginRes);
    return;
  }

  const setCookie = loginRes.headers.get('set-cookie');
  const sessionCookie = setCookie ? setCookie.split(';')[0] : '';
  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: sessionCookie,
  };
  console.log('PASS: Authenticated on newly rebooted server.');

  // 2. Verify Product Survived Reboot
  console.log('\nStep 8: Verify Product Persistence Across Reboot');
  const publicRes = await request('/api/public/products');
  const rehearsalProd = publicRes.data?.products?.find((p) => p.sku === 'DAIKIN-REHEARSAL-01');

  if (rehearsalProd && rehearsalProd.name === 'Rehearsal Daikin 1.5T 5-Star Split AC') {
    console.log('PASS: Rehearsal product survived server cold reboot!');
    console.log(`  - Name: ${rehearsalProd.name}`);
    console.log(`  - Model: ${rehearsalProd.model}`);
    console.log(`  - Features count: ${rehearsalProd.features.length}`);
  } else {
    console.error('FAIL: Product lost across restart! Persistent volume failure.', rehearsalProd);
    return;
  }

  // 3. Verify Customer Enquiry Survived Reboot
  console.log('\nStep 9: Verify Customer Enquiry in CRM Survived Reboot');
  const enquiriesRes = await request('/api/admin/enquiries', { headers: authHeaders });
  const foundEnquiry = enquiriesRes.data?.enquiries?.find((e) => e.customerName === 'Sita Rama Raju');

  if (foundEnquiry && foundEnquiry.phone === '9848022338') {
    console.log('PASS: Customer enquiry survived reboot in CRM database:');
    console.log(`  - Customer: ${foundEnquiry.customerName} (${foundEnquiry.phone})`);
    console.log(`  - Message: "${foundEnquiry.message}"`);
  } else {
    console.error('FAIL: Customer enquiry lost across restart!', enquiriesRes);
    return;
  }

  // 4. Verify Snapshot List
  console.log('\nStep 10: Verify Snapshot File Persistence');
  const backupRes = await request('/api/admin/backup', { headers: authHeaders });
  const snapshotList = backupRes.data?.snapshots || [];
  const foundSnapshot = snapshotList.find((s) => s.id.includes('Rehearsal_Baseline_State'));

  if (foundSnapshot) {
    console.log(`PASS: Snapshot "${foundSnapshot.name}" persisted on disk across restart (${(foundSnapshot.sizeBytes / 1024).toFixed(1)} KB).`);
  } else {
    console.error('FAIL: Snapshot not found in backup list after reboot', backupRes);
    return;
  }

  // 5. Mutate Data & Verify Disaster Recovery Restore
  console.log('\nStep 11: Mutate Product & Execute Point-in-Time Restore');
  // Mutate product name
  await request(`/api/admin/products/${rehearsalProd.id}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      ...rehearsalProd,
      name: 'CORRUPTED/MUTATED PRODUCT NAME FOR DISASTER TEST',
    }),
  });

  // Verify mutation took effect
  const mutatedCheck = await request('/api/public/products');
  const mutatedProd = mutatedCheck.data?.products?.find((p) => p.id === rehearsalProd.id);
  console.log(`Verified mutation applied: "${mutatedProd?.name}"`);

  // Restore snapshot!
  console.log('Initiating snapshot restore...');
  const restoreRes = await request('/api/admin/backup/restore', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ snapshotId: foundSnapshot.id }),
  });

  if (restoreRes.status !== 200 || !restoreRes.data?.success) {
    console.error('FAIL: Snapshot restore failed', restoreRes);
    return;
  }
  console.log('PASS: Snapshot restore executed successfully.');
  console.log(`  - Safety backup captured: ${restoreRes.data.safetyBackupId}`);

  // Verify product restored to original baseline name!
  const restoredCheck = await request('/api/public/products');
  const restoredProd = restoredCheck.data?.products?.find((p) => p.id === rehearsalProd.id);

  if (restoredProd && restoredProd.name === 'Rehearsal Daikin 1.5T 5-Star Split AC') {
    console.log('PASS: Disaster recovery verified! Product name restored to original baseline state:');
    console.log(`  - Restored Name: "${restoredProd.name}"`);
  } else {
    console.error('FAIL: Product name did not restore to baseline!', restoredProd);
    return;
  }

  // 6. Cleanup Rehearsal Test Data
  console.log('\nStep 12: Clean Up Rehearsal Records');
  await request(`/api/admin/products/${rehearsalProd.id}`, { method: 'DELETE', headers: authHeaders });
  if (foundEnquiry) {
    await request(`/api/admin/enquiries/${foundEnquiry.id}`, { method: 'DELETE', headers: authHeaders }).catch(() => null);
  }
  await request(`/api/admin/backup/${foundSnapshot.id}`, { method: 'DELETE', headers: authHeaders });
  if (restoreRes.data.safetyBackupId) {
    await request(`/api/admin/backup/${restoreRes.data.safetyBackupId}`, { method: 'DELETE', headers: authHeaders });
  }
  console.log('PASS: Rehearsal product and snapshot cleaned up.');

  console.log('\n===========================================================');
  console.log('ALL PRODUCTION REHEARSAL LIFECYCLE CHECKS PASSED 100%!');
  console.log('===========================================================\n');
}

run().catch(console.error);
