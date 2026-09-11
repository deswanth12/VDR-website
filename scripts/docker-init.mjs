// scripts/docker-init.mjs
import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const SNAPSHOTS_DIR = path.join(DATA_DIR, 'snapshots');
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads');

async function main() {
  console.log('[VDR Init] Checking volume mounts and persistence directories...');

  // Ensure persistence directories exist
  [DATA_DIR, SNAPSHOTS_DIR, UPLOADS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`[VDR Init] Created persistent directory: ${dir}`);
    }
  });

  // Resolve DB URL
  const rawDbUrl = process.env.DATABASE_URL || `file:${path.join(DATA_DIR, 'vdr.db')}`;
  console.log(`[VDR Init] Initializing database connection: ${rawDbUrl}`);

  const client = createClient({ url: rawDbUrl });

  const ddl = `
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      admin_id TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      icon TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      tagline TEXT,
      description TEXT,
      category_tag TEXT,
      highlights_json TEXT,
      logo_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      brand_id TEXT NOT NULL REFERENCES brands(id),
      category_id TEXT NOT NULL REFERENCES categories(id),
      model TEXT,
      sku TEXT,
      short_summary TEXT,
      description TEXT,
      suitable_for TEXT,
      tonnage_or_capacity TEXT,
      star_rating INTEGER,
      cooling_type TEXT,
      refrigerant TEXT,
      iseer TEXT,
      power_consumption TEXT,
      inverter_tech INTEGER DEFAULT 1,
      coil_material TEXT,
      warranty TEXT,
      availability TEXT,
      enquiry_message TEXT,
      is_demo INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Verified Product',
      specification_status TEXT NOT NULL DEFAULT 'Verified Spec',
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      alt_text TEXT,
      is_primary INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_features (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      feature_text TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_specs (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      spec_label TEXT NOT NULL,
      spec_value TEXT NOT NULL,
      is_key_spec INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp_number TEXT,
      product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT,
      inquiry_type TEXT NOT NULL DEFAULT 'General',
      message TEXT,
      source TEXT NOT NULL DEFAULT 'website',
      status TEXT NOT NULL DEFAULT 'new',
      internal_notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS business_info (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS homepage_content (
      section_key TEXT PRIMARY KEY,
      content_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `;

  await client.executeMultiple(ddl);
  console.log('[VDR Init] Database schemas verified (CREATE TABLE IF NOT EXISTS).');

  // Check if initial admin exists
  const adminCheck = await client.execute('SELECT COUNT(*) as count FROM admins');
  const count = Number(adminCheck.rows[0].count);

  if (count === 0) {
    const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@vijayadurgarefrigeration.com';
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'VdrAdmin@2026!';
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const now = new Date().toISOString();

    await client.execute({
      sql: `INSERT INTO admins (id, email, password_hash, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ['admin_primary', adminEmail, passwordHash, 'VDR Operations Manager', 'superadmin', now, now],
    });
    console.log(`[VDR Init] Initial administrator account provisioned: ${adminEmail}`);
  } else {
    console.log(`[VDR Init] Found existing admin accounts (${count}). Retaining existing credentials.`);
  }

  client.close();
  console.log('[VDR Init] Cold start verification completed successfully.');
}

main().catch((err) => {
  console.error('[VDR Init] Error during initialization:', err);
  process.exit(1);
});
