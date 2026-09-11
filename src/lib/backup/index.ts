// src/lib/backup/index.ts
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import {
  products,
  categories,
  brands,
  productImages,
  productFeatures,
  productSpecs,
  businessInfo,
  homepageContent,
  enquiries,
} from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

export interface SnapshotMetadata {
  id: string;
  name: string;
  filename: string;
  createdAt: string;
  sizeBytes: number;
  totalProducts: number;
  totalEnquiries: number;
  isSafetyBackup?: boolean;
}

const DB_PATH = path.join(process.cwd(), 'data', 'vdr.db');
const SNAPSHOT_DIR = path.join(process.cwd(), 'data', 'snapshots');

function ensureSnapshotDir() {
  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }
}

/**
 * Get current database status and stats
 */
export async function getDatabaseStats() {
  ensureSnapshotDir();

  let dbSizeBytes = 0;
  if (fs.existsSync(DB_PATH)) {
    const stat = fs.statSync(DB_PATH);
    dbSizeBytes = stat.size;
  }

  const allProducts = await db.select().from(products).all();
  const allEnquiries = await db.select().from(enquiries).all();

  const snapshots = await listSnapshots();
  const lastSnapshot = snapshots.length > 0 ? snapshots[0].createdAt : null;

  return {
    status: 'Healthy & Connected',
    dbPath: DB_PATH,
    dbSizeBytes,
    dbSizeFormatted: `${(dbSizeBytes / (1024 * 1024)).toFixed(2)} MB`,
    totalProducts: allProducts.length,
    totalEnquiries: allEnquiries.length,
    snapshotCount: snapshots.length,
    lastSnapshot,
  };
}

/**
 * Create a point-in-time snapshot of SQLite database
 */
export async function createSnapshot(name?: string, isSafetyBackup = false): Promise<SnapshotMetadata> {
  ensureSnapshotDir();

  if (!fs.existsSync(DB_PATH)) {
    throw new Error('Database file does not exist to snapshot.');
  }

  const timestamp = Date.now();
  const dateIso = new Date().toISOString();
  const cleanName = (name || (isSafetyBackup ? 'safety_pre_restore' : 'manual_backup'))
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_');

  const snapshotId = `snap_${timestamp}_${cleanName}`;
  const dbFilename = `${snapshotId}.db`;
  const metaFilename = `${snapshotId}.json`;

  const targetDbPath = path.join(SNAPSHOT_DIR, dbFilename);
  const targetMetaPath = path.join(SNAPSHOT_DIR, metaFilename);

  // Copy database binary safely
  await fs.promises.copyFile(DB_PATH, targetDbPath);

  const stats = fs.statSync(targetDbPath);
  const allProducts = await db.select().from(products).all();
  const allEnquiries = await db.select().from(enquiries).all();

  const metadata: SnapshotMetadata = {
    id: snapshotId,
    name: name || (isSafetyBackup ? `Pre-Restore Safety Snapshot (${new Date().toLocaleTimeString()})` : `Snapshot ${new Date().toLocaleDateString()}`),
    filename: dbFilename,
    createdAt: dateIso,
    sizeBytes: stats.size,
    totalProducts: allProducts.length,
    totalEnquiries: allEnquiries.length,
    isSafetyBackup,
  };

  await fs.promises.writeFile(targetMetaPath, JSON.stringify(metadata, null, 2));

  return metadata;
}

/**
 * List all available snapshots
 */
export async function listSnapshots(): Promise<SnapshotMetadata[]> {
  ensureSnapshotDir();

  const files = await fs.promises.readdir(SNAPSHOT_DIR);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  const snapshots: SnapshotMetadata[] = [];

  for (const jsonFile of jsonFiles) {
    try {
      const content = await fs.promises.readFile(path.join(SNAPSHOT_DIR, jsonFile), 'utf-8');
      const meta = JSON.parse(content) as SnapshotMetadata;
      // verify corresponding db exists
      const dbFile = path.join(SNAPSHOT_DIR, meta.filename);
      if (fs.existsSync(dbFile)) {
        snapshots.push(meta);
      }
    } catch (err) {
      console.error(`Error reading snapshot meta ${jsonFile}:`, err);
    }
  }

  // Sort newest first
  return snapshots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get the absolute file path of a snapshot .db file
 */
export function getSnapshotFilePath(snapshotId: string): string | null {
  ensureSnapshotDir();
  const dbFile = path.join(SNAPSHOT_DIR, `${snapshotId}.db`);
  if (fs.existsSync(dbFile)) {
    return dbFile;
  }
  return null;
}

/**
 * Delete a snapshot by ID
 */
export async function deleteSnapshot(snapshotId: string): Promise<boolean> {
  ensureSnapshotDir();
  const dbFile = path.join(SNAPSHOT_DIR, `${snapshotId}.db`);
  const metaFile = path.join(SNAPSHOT_DIR, `${snapshotId}.json`);

  let removed = false;
  if (fs.existsSync(dbFile)) {
    await fs.promises.unlink(dbFile);
    removed = true;
  }
  if (fs.existsSync(metaFile)) {
    await fs.promises.unlink(metaFile);
  }
  return removed;
}

/**
 * Safe Restore Workflow:
 * 1. Takes safety snapshot of current live DB
 * 2. Validates target snapshot header
 * 3. Overwrites vdr.db with target snapshot
 * 4. Cleans WAL/SHM
 * 5. Runs test query to verify integrity
 * 6. Auto-rolls back to safety snapshot if verification fails
 * 7. Revalidates public site
 */
export async function restoreSnapshot(snapshotId: string): Promise<{
  success: boolean;
  safetyBackupId: string;
  restoredProducts: number;
}> {
  ensureSnapshotDir();

  const targetDbPath = getSnapshotFilePath(snapshotId);
  if (!targetDbPath) {
    throw new Error('Target snapshot file does not exist.');
  }

  // Verify target file is a valid SQLite DB
  const headerBuffer = Buffer.alloc(16);
  const fd = fs.openSync(targetDbPath, 'r');
  fs.readSync(fd, headerBuffer, 0, 16, 0);
  fs.closeSync(fd);

  if (!headerBuffer.toString('utf-8').startsWith('SQLite format 3')) {
    throw new Error('Target snapshot is corrupted or is not a valid SQLite database.');
  }

  // Step 1: Create atomic safety backup of current state
  const safetyBackup = await createSnapshot('Pre_Restore_Safety_Backup', true);

  try {
    // Step 2: Overwrite vdr.db with snapshot
    await fs.promises.copyFile(targetDbPath, DB_PATH);

    // Step 3: Remove lingering WAL/SHM locks
    const walPath = `${DB_PATH}-wal`;
    const shmPath = `${DB_PATH}-shm`;
    if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
    if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);

    // Step 4: Verify integrity by querying restored database
    const verifyProducts = await db.select().from(products).all();

    // Step 5: Revalidate affected public routes
    try {
      revalidatePath('/');
      revalidatePath('/catalogue');
      revalidatePath('/compare');
      revalidatePath('/showroom');
    } catch (e) {
      console.error('Revalidation error after restore:', e);
    }

    return {
      success: true,
      safetyBackupId: safetyBackup.id,
      restoredProducts: verifyProducts.length,
    };
  } catch (err: any) {
    console.error('Restore failed! Initiating emergency rollback to safety backup...', err);

    // Emergency Rollback to safety backup
    const safetyDbPath = getSnapshotFilePath(safetyBackup.id);
    if (safetyDbPath && fs.existsSync(safetyDbPath)) {
      await fs.promises.copyFile(safetyDbPath, DB_PATH);
    }

    throw new Error(`Restore failed: ${err.message}. Safely rolled back to prior database state.`);
  }
}

/**
 * Export full catalogue in structured portable JSON format
 */
export async function exportFullJson(): Promise<Record<string, any>> {
  const [
    allProducts,
    allCategories,
    allBrands,
    allImages,
    allFeatures,
    allSpecs,
    allBusiness,
    allHomepage,
    allEnquiries,
  ] = await Promise.all([
    db.select().from(products).all(),
    db.select().from(categories).all(),
    db.select().from(brands).all(),
    db.select().from(productImages).all(),
    db.select().from(productFeatures).all(),
    db.select().from(productSpecs).all(),
    db.select().from(businessInfo).all(),
    db.select().from(homepageContent).all(),
    db.select().from(enquiries).all(),
  ]);

  return {
    meta: {
      exportedAt: new Date().toISOString(),
      generator: 'Vijaya Durga Refrigeration Admin CMS',
      version: '1.0.0',
      databaseEngine: 'SQLite / LibSQL',
    },
    counts: {
      products: allProducts.length,
      categories: allCategories.length,
      brands: allBrands.length,
      images: allImages.length,
      features: allFeatures.length,
      specs: allSpecs.length,
      enquiries: allEnquiries.length,
    },
    data: {
      products: allProducts,
      categories: allCategories,
      brands: allBrands,
      productImages: allImages,
      productFeatures: allFeatures,
      productSpecs: allSpecs,
      businessInfo: allBusiness,
      homepageContent: allHomepage,
      enquiries: allEnquiries,
    },
  };
}
