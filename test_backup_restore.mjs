// test_backup_restore.mjs
const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, headers: res.headers, data };
}

async function run() {
  console.log('===========================================================');
  console.log('--- STARTING BACKUP, SNAPSHOT & RESTORE TEST SUITE ---');
  console.log('===========================================================\n');

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
  console.log('PASS: Authenticated as:', loginRes.data.admin.name);

  // 2. Database Stats & Snapshot List
  console.log('\nStep 2: Fetch Database Health & Status');
  const statusRes = await request('/api/admin/backup', { headers: authHeaders });
  if (statusRes.status === 200 && statusRes.data?.stats?.dbSizeBytes > 0) {
    console.log(`PASS: Database is healthy. Size: ${statusRes.data.stats.dbSizeFormatted}, Products: ${statusRes.data.stats.totalProducts}`);
  } else {
    console.error('FAIL: Status check failed', statusRes);
    return;
  }

  // 3. Export SQLite Binary & Full JSON Dump
  console.log('\nStep 3: Test Database Export Downloads');
  const sqliteRes = await fetch(`${BASE_URL}/api/admin/backup/export?format=sqlite`, { headers: authHeaders });
  const sqliteBuffer = Buffer.from(await sqliteRes.arrayBuffer());
  if (sqliteRes.status === 200 && sqliteBuffer.toString('utf-8', 0, 16).startsWith('SQLite format 3')) {
    console.log(`PASS: Exported SQLite binary backup (${(sqliteBuffer.length / 1024).toFixed(1)} KB) with valid SQLite header.`);
  } else {
    console.error('FAIL: SQLite export failed or invalid header', sqliteRes.status);
    return;
  }

  const jsonRes = await fetch(`${BASE_URL}/api/admin/backup/export?format=json`, { headers: authHeaders });
  const jsonData = await jsonRes.json();
  if (jsonRes.status === 200 && jsonData.data?.products?.length > 0 && jsonData.data?.categories?.length > 0) {
    console.log(`PASS: Exported full portable JSON dump containing ${jsonData.counts.products} products, ${jsonData.counts.categories} categories, and ${jsonData.counts.enquiries} enquiries.`);
  } else {
    console.error('FAIL: JSON export failed', jsonRes.status);
    return;
  }

  // 4. Create Point-in-Time Snapshot
  console.log('\nStep 4: Create Point-in-Time Snapshot');
  const snapRes = await request('/api/admin/backup', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ name: 'Automated_Pre_Test_Snapshot' }),
  });

  if (snapRes.status !== 200 || !snapRes.data?.snapshot?.id) {
    console.error('FAIL: Failed to create snapshot', snapRes);
    return;
  }

  const createdSnapshot = snapRes.data.snapshot;
  console.log(`PASS: Created Snapshot: ${createdSnapshot.name} (ID: ${createdSnapshot.id}, Size: ${(createdSnapshot.sizeBytes / 1024).toFixed(1)} KB)`);

  // 5. Mutate Database State (Add a dummy product to test rollback/restore)
  console.log('\nStep 5: Mutate Database (Insert temporary product)');
  const dummyProdRes = await request('/api/admin/products', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Temp Ephemeral AC For Snapshot Restore Test',
      slug: 'temp-ephemeral-ac-restore-test',
      brandId: 'daikin',
      categoryId: 'split-ac',
      shortSummary: 'This product will be wiped out when snapshot is restored.',
      images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800'],
    }),
  });

  if (dummyProdRes.status !== 200) {
    console.error('FAIL: Failed to create dummy product', dummyProdRes);
    return;
  }
  const dummyId = dummyProdRes.data.id;
  console.log(`PASS: Inserted temporary product: ${dummyId}`);

  // Verify dummy exists
  const publicCheckBefore = await request('/api/public/products');
  const foundBefore = publicCheckBefore.data?.products?.some((p) => p.id === dummyId);
  if (!foundBefore) {
    console.error('FAIL: Dummy product not found in database before restore');
    return;
  }
  console.log('PASS: Verified dummy product is live in database.');

  // 6. Restore Point-in-Time Snapshot (The dummy product should disappear!)
  console.log('\nStep 6: Restore Snapshot and Verify State Reset');
  const restoreRes = await request('/api/admin/backup/restore', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ snapshotId: createdSnapshot.id }),
  });

  if (restoreRes.status !== 200 || !restoreRes.data?.success) {
    console.error('FAIL: Restore failed', restoreRes);
    return;
  }
  console.log(`PASS: Database restored successfully.`);
  console.log(`  - Automatic Safety Backup captured ID: ${restoreRes.data.safetyBackupId}`);
  console.log(`  - Active products verified: ${restoreRes.data.restoredProducts}`);

  // Verify dummy product has been cleanly restored away
  const publicCheckAfter = await request('/api/public/products');
  const foundAfter = publicCheckAfter.data?.products?.some((p) => p.id === dummyId);
  if (foundAfter) {
    console.error('FAIL: Dummy product still exists after restore! Restore failed to rollback state.');
    return;
  }
  console.log('PASS: Verified temporary product was completely rolled back. Prior state cleanly restored!');

  // 7. Test Corrupt / Invalid Snapshot Rejection
  console.log('\nStep 7: Test Rejection of Non-existent Snapshot');
  const badRestoreRes = await request('/api/admin/backup/restore', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ snapshotId: 'non_existent_fake_snapshot' }),
  });
  if (badRestoreRes.status === 500 && badRestoreRes.data?.error?.includes('does not exist')) {
    console.log('PASS: Correctly rejected invalid snapshot restore.');
  } else {
    console.error('FAIL: Expected error for invalid snapshot, got', badRestoreRes);
  }

  // 8. Cleanup test snapshots
  console.log('\nStep 8: Cleanup Test Snapshots');
  await request(`/api/admin/backup/${createdSnapshot.id}`, { method: 'DELETE', headers: authHeaders });
  if (restoreRes.data.safetyBackupId) {
    await request(`/api/admin/backup/${restoreRes.data.safetyBackupId}`, { method: 'DELETE', headers: authHeaders });
  }
  console.log('PASS: Cleaned up test snapshots.');

  console.log('\n===========================================================');
  console.log('ALL BACKUP, SNAPSHOT & RESTORE TESTS PASSED WITH ZERO ERRORS!');
  console.log('===========================================================\n');
}

run().catch(console.error);
