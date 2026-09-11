// test_production_persistence_lifecycle.mjs
import cp from 'child_process';
import path from 'path';
import fs from 'fs';

const PORT = '3005';
const BASE_URL = `http://127.0.0.1:${PORT}`;

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function spawnServer(instanceName) {
  console.log(`\n[Lifecycle] Spawning standalone production server: ${instanceName} on port ${PORT}...`);
  const env = {
    ...process.env,
    PORT,
    HOSTNAME: '127.0.0.1',
    NODE_ENV: 'production',
  };

  const proc = cp.spawn('node', ['.next/standalone/server.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] });

  proc.stdout.on('data', (d) => {
    const msg = d.toString().trim();
    if (msg) console.log(`  [${instanceName} STDOUT] ${msg}`);
  });

  proc.stderr.on('data', (d) => {
    const msg = d.toString().trim();
    if (msg) console.error(`  [${instanceName} STDERR] ${msg}`);
  });

  return proc;
}

async function waitForServer(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/robots.txt`);
      if (res.status === 200) return true;
    } catch {
      // Waiting for socket
    }
    await sleep(400);
  }
  throw new Error(`Server failed to start within ${timeoutMs}ms on ${BASE_URL}`);
}

async function run() {
  console.log('================================================================');
  console.log('--- VDR PRODUCTION DEPLOYMENT & CONTAINER LIFECYCLE TEST SUITE ---');
  console.log('================================================================');

  let instance1 = null;
  let instance2 = null;
  let sessionCookie = '';
  let createdProductId = '';
  let createdSnapshotId = '';
  let uploadedImageFilename = `test_persistence_${Date.now()}.png`;

  try {
    // -------------------------------------------------------------
    // STAGE 1: BOOT INSTANCE 1
    // -------------------------------------------------------------
    instance1 = spawnServer('INSTANCE_1');
    await waitForServer();
    console.log('PASS: Instance 1 is healthy and responding.');

    // -------------------------------------------------------------
    // STAGE 2: ADMIN AUTHENTICATION ON INSTANCE 1
    // -------------------------------------------------------------
    console.log('\n--- Step 1: Admin Authentication on Instance 1 ---');
    const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@vijayadurgarefrigeration.com',
        password: 'VdrAdmin@2026!',
      }),
    });

    if (!loginRes.ok) throw new Error(`Login failed on Instance 1: ${loginRes.status}`);
    const setCookie = loginRes.headers.get('set-cookie');
    sessionCookie = setCookie ? setCookie.split(';')[0] : '';
    console.log('PASS: Admin logged in on Instance 1. Session token issued.');

    // Verify session on Instance 1
    const meRes1 = await fetch(`${BASE_URL}/api/admin/auth/me`, {
      headers: { cookie: sessionCookie },
    });
    const meData1 = await meRes1.json();
    if (!meRes1.ok || !meData1.admin) throw new Error('Failed to verify session on Instance 1');
    console.log(`PASS: Session verified for: ${meData1.admin.email}`);

    // -------------------------------------------------------------
    // STAGE 3: STATE MUTATIONS ON INSTANCE 1
    // -------------------------------------------------------------
    console.log('\n--- Step 2: Database Product Mutation on Instance 1 ---');
    const productPayload = {
      name: 'O-General 2.0 Ton 5-Star Tropical Inverter AC',
      slug: `o-general-2-0-ton-tropical-${Date.now()}`,
      brandId: 'daikin',
      categoryId: 'split-ac',
      model: 'ASGG24CPTA-DEMO',
      sku: `OGEN-24CPTA-${Date.now()}`,
      shortSummary: 'Heavy tropical inverter cooling designed for extreme 55°C ambient temperatures.',
      description: 'Engineered with double-grooved copper coils and hyper-tropical rotary compressor.',
      suitableFor: 'Large Living Halls & Showrooms (200 - 280 sq.ft)',
      tonnageOrCapacity: '2.0 Ton',
      starRating: '5',
      coolingType: 'Hyper Tropical Inverter',
      refrigerant: 'R-32',
      coilMaterial: '100% Grooved Pure Copper',
      features: ['Hyper Tropical Compressor', '55°C Extreme Ambience Operation', 'PM 2.5 Filtration'],
      specs: [
        { label: 'Cooling Capacity', value: '7100 Watts', isKeySpec: true },
        { label: 'Air Flow Rate', value: '1150 CFM', isKeySpec: false },
      ],
      images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop'],
    };

    const createRes = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: sessionCookie,
      },
      body: JSON.stringify(productPayload),
    });

    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(`Product creation failed: ${createData.error}`);
    createdProductId = createData.id;
    console.log(`PASS: Product written to database. ID: ${createdProductId}`);

    // Create a physical image file in public/uploads to simulate file upload persistence
    console.log('\n--- Step 3: Write Uploaded Media Asset into Volume ---');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const standaloneUploadsDir = path.join(process.cwd(), '.next', 'standalone', 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    if (!fs.existsSync(standaloneUploadsDir)) fs.mkdirSync(standaloneUploadsDir, { recursive: true });

    const imageFilePath = path.join(uploadsDir, uploadedImageFilename);
    const standaloneImageFilePath = path.join(standaloneUploadsDir, uploadedImageFilename);
    const dummyPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(imageFilePath, dummyPngBuffer);
    fs.writeFileSync(standaloneImageFilePath, dummyPngBuffer);

    // Verify image responds over HTTP
    const imgRes1 = await fetch(`${BASE_URL}/uploads/${uploadedImageFilename}`);
    if (!imgRes1.ok) throw new Error(`Image asset not reachable on Instance 1: ${imgRes1.status}`);
    console.log(`PASS: Uploaded image successfully served at /uploads/${uploadedImageFilename} (HTTP 200).`);

    // Capture point-in-time snapshot
    console.log('\n--- Step 4: Capture Point-in-Time Snapshot on Instance 1 ---');
    const snapRes = await fetch(`${BASE_URL}/api/admin/backup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: sessionCookie,
      },
      body: JSON.stringify({ name: 'Pre_Restart_Verification_Snapshot' }),
    });

    const snapData = await snapRes.json();
    if (!snapRes.ok) throw new Error(`Snapshot creation failed: ${snapData.error}`);
    createdSnapshotId = snapData.snapshot.id;
    console.log(`PASS: Created Snapshot: ${snapData.snapshot.name} (ID: ${createdSnapshotId})`);

    // -------------------------------------------------------------
    // STAGE 4: SIMULATE CONTAINER CRASH / PROCESS RESTART
    // -------------------------------------------------------------
    console.log('\n=============================================================');
    console.log('>>> SIMULATING CONTAINER DESTRUCTION & PROCESS RESTART <<<');
    console.log('=============================================================');
    console.log('[Lifecycle] Sending SIGTERM to Instance 1...');
    instance1.kill('SIGTERM');
    await sleep(1500);

    // Verify Instance 1 is dead
    let dead = false;
    try {
      await fetch(`${BASE_URL}/robots.txt`);
    } catch {
      dead = true;
    }
    if (!dead) throw new Error('Instance 1 failed to shut down cleanly');
    console.log('PASS: Instance 1 process terminated. Port 3005 is free.');

    // -------------------------------------------------------------
    // STAGE 5: BOOT INSTANCE 2 (Simulating redeployment / restart)
    // -------------------------------------------------------------
    instance2 = spawnServer('INSTANCE_2');
    await waitForServer();
    console.log('PASS: Instance 2 is online and ready.');

    // -------------------------------------------------------------
    // STAGE 6: VERIFY PERSISTENCE ACROSS RESTART
    // -------------------------------------------------------------
    console.log('\n=============================================================');
    console.log('>>> EXECUTING POST-RESTART ENGINEERING VERIFICATION <<<');
    console.log('=============================================================');

    // CHECK 1: Database record survives
    console.log('\n[Check 1] Verify SQLite Database Writes Survived:');
    const publicProductsRes = await fetch(`${BASE_URL}/api/public/products`);
    const publicProductsData = await publicProductsRes.json();
    const foundProduct = publicProductsData.products?.find((p) => p.id === createdProductId);

    if (!foundProduct) {
      throw new Error(`CRITICAL: Product ${createdProductId} was LOST across server restart!`);
    }
    console.log(`PASS: Product survived restart! Found: "${foundProduct.name}" (Model: ${foundProduct.model})`);

    // CHECK 2: Uploaded image file survives
    console.log('\n[Check 2] Verify Uploaded Media Assets Survived:');
    const imgRes2 = await fetch(`${BASE_URL}/uploads/${uploadedImageFilename}`);
    if (!imgRes2.ok) {
      throw new Error(`CRITICAL: Uploaded image file was LOST across server restart! HTTP ${imgRes2.status}`);
    }
    console.log(`PASS: Uploaded image survived restart! Served at /uploads/${uploadedImageFilename} (HTTP 200).`);

    // CHECK 3: Session behavior survives
    console.log('\n[Check 3] Verify Admin Session State Survived:');
    const meRes2 = await fetch(`${BASE_URL}/api/admin/auth/me`, {
      headers: { cookie: sessionCookie },
    });
    const meData2 = await meRes2.json();
    if (!meRes2.ok || !meData2.admin) {
      throw new Error('CRITICAL: Admin session cookie from Instance 1 was rejected by Instance 2!');
    }
    console.log(`PASS: Session token from Instance 1 remained valid on Instance 2! Logged in as: ${meData2.admin.name}`);

    // CHECK 4: Backup snapshot survives
    console.log('\n[Check 4] Verify Point-in-Time Disaster Recovery Snapshots Survived:');
    const backupListRes = await fetch(`${BASE_URL}/api/admin/backup`, {
      headers: { cookie: sessionCookie },
    });
    const backupListData = await backupListRes.json();
    const foundSnapshot = backupListData.snapshots?.find((s) => s.id === createdSnapshotId);

    if (!foundSnapshot) {
      throw new Error(`CRITICAL: Snapshot ${createdSnapshotId} was LOST across server restart!`);
    }
    console.log(`PASS: Snapshot survived restart! Found: "${foundSnapshot.name}" (${(foundSnapshot.sizeBytes / 1024).toFixed(1)} KB)`);

    // CHECK 5: Restore works post-restart
    console.log('\n[Check 5] Verify Snapshot Restore Executes Post-Restart:');
    // Mutate state first
    await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { cookie: sessionCookie },
    });
    console.log('  Deleted test product to create state drift.');

    // Restore pre-restart snapshot
    const restoreRes = await fetch(`${BASE_URL}/api/admin/backup/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: sessionCookie,
      },
      body: JSON.stringify({ snapshotId: createdSnapshotId }),
    });

    const restoreData = await restoreRes.json();
    if (!restoreRes.ok) throw new Error(`Restore failed on Instance 2: ${restoreData.error}`);
    console.log(`  Restore executed successfully. Safety backup ID: ${restoreData.safetyBackupId}`);

    // Verify restored product is back
    const verifyRestoredRes = await fetch(`${BASE_URL}/api/public/products`);
    const verifyRestoredData = await verifyRestoredRes.json();
    const restoredProduct = verifyRestoredData.products?.find((p) => p.id === createdProductId);

    if (!restoredProduct) {
      throw new Error('CRITICAL: Product was NOT restored from pre-restart snapshot!');
    }
    console.log(`PASS: State successfully restored post-restart! Product restored: "${restoredProduct.name}"`);

    // -------------------------------------------------------------
    // STAGE 7: CLEANUP
    // -------------------------------------------------------------
    console.log('\n--- Cleaning up test artifacts ---');
    await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { cookie: sessionCookie },
    });

    await fetch(`${BASE_URL}/api/admin/backup/${createdSnapshotId}`, {
      method: 'DELETE',
      headers: { cookie: sessionCookie },
    });

    if (fs.existsSync(imageFilePath)) {
      fs.unlinkSync(imageFilePath);
    }
    if (fs.existsSync(standaloneImageFilePath)) {
      fs.unlinkSync(standaloneImageFilePath);
    }
    console.log('PASS: Cleaned up test product, test snapshot, and test image.');

    console.log('\n================================================================');
    console.log('ALL CONTAINER LIFECYCLE & PERSISTENCE TESTS PASSED WITH 100% SUCCESS!');
    console.log('================================================================');
  } finally {
    if (instance1 && !instance1.killed) {
      instance1.kill();
    }
    if (instance2 && !instance2.killed) {
      instance2.kill();
    }
  }
}

run().catch((err) => {
  console.error('\n❌ FATAL TEST FAILURE:', err);
  process.exit(1);
});
