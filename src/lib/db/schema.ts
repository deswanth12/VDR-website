// src/lib/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// 1. ADMINS TABLE
export const admins = sqliteTable('admins', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 2. SESSIONS TABLE
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  adminId: text('admin_id')
    .notNull()
    .references(() => admins.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
});

// 3. CATEGORIES TABLE
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(), // e.g. 'split-ac', 'washing-machine', 'ac-spares'
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  isActive: integer('is_active').notNull().default(1),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 4. BRANDS TABLE
export const brands = sqliteTable('brands', {
  id: text('id').primaryKey(), // e.g. 'daikin', 'lloyd', 'mitsubishi-electric'
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  tagline: text('tagline'),
  description: text('description'),
  categoryTag: text('category_tag'),
  highlightsJson: text('highlights_json'), // JSON array of bullet points
  logoUrl: text('logo_url'),
  isActive: integer('is_active').notNull().default(1),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 5. PRODUCTS TABLE
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  brandId: text('brand_id')
    .notNull()
    .references(() => brands.id),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id),
  model: text('model'),
  sku: text('sku'),
  shortSummary: text('short_summary'),
  description: text('description'),
  suitableFor: text('suitable_for'),
  tonnageOrCapacity: text('tonnage_or_capacity'),
  starRating: integer('star_rating'),
  coolingType: text('cooling_type'),
  refrigerant: text('refrigerant'),
  iseer: text('iseer'),
  powerConsumption: text('power_consumption'),
  inverterTech: integer('inverter_tech').default(1),
  coilMaterial: text('coil_material'),
  warranty: text('warranty'),
  availability: text('availability'),
  enquiryMessage: text('enquiry_message'),
  isDemo: integer('is_demo').notNull().default(0),
  status: text('status').notNull().default('Verified Product'),
  specificationStatus: text('specification_status').notNull().default('Verified Spec'),
  isFeatured: integer('is_featured').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 6. PRODUCT IMAGES TABLE
export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  altText: text('alt_text'),
  isPrimary: integer('is_primary').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

// 7. PRODUCT FEATURES TABLE
export const productFeatures = sqliteTable('product_features', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  featureText: text('feature_text').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

// 8. PRODUCT SPECIFICATIONS TABLE
export const productSpecs = sqliteTable('product_specs', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  specLabel: text('spec_label').notNull(),
  specValue: text('spec_value').notNull(),
  isKeySpec: integer('is_key_spec').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
});

// 9. ENQUIRIES TABLE
export const enquiries = sqliteTable('enquiries', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  whatsappNumber: text('whatsapp_number'),
  productId: text('product_id').references(() => products.id, { onDelete: 'set null' }),
  productName: text('product_name'),
  inquiryType: text('inquiry_type').notNull().default('General'),
  message: text('message'),
  source: text('source').notNull().default('website'),
  status: text('status').notNull().default('new'), // 'new' | 'contacted' | 'follow-up' | 'closed'
  internalNotes: text('internal_notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 10. BUSINESS INFORMATION TABLE
export const businessInfo = sqliteTable('business_info', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 11. HOMEPAGE CONTENT TABLE
export const homepageContent = sqliteTable('homepage_content', {
  sectionKey: text('section_key').primaryKey(),
  contentJson: text('content_json').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Types exported for application-wide type safety
export type Admin = typeof admins.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type CategoryRecord = typeof categories.$inferSelect;
export type BrandRecord = typeof brands.$inferSelect;
export type ProductRecord = typeof products.$inferSelect;
export type ProductImageRecord = typeof productImages.$inferSelect;
export type ProductFeatureRecord = typeof productFeatures.$inferSelect;
export type ProductSpecRecord = typeof productSpecs.$inferSelect;
export type EnquiryRecord = typeof enquiries.$inferSelect;
export type BusinessInfoRecord = typeof businessInfo.$inferSelect;
export type HomepageContentRecord = typeof homepageContent.$inferSelect;
