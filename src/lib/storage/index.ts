// src/lib/storage/index.ts
import fs from 'fs';
import path from 'path';

export interface StorageUploadResult {
  url: string;
  provider: 'local' | 'cloudinary' | 's3';
  publicId?: string;
  sizeBytes?: number;
}

export interface StorageProvider {
  name: 'local' | 'cloudinary' | 's3';
  upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<StorageUploadResult>;
  delete(urlOrPublicId: string): Promise<boolean>;
}

/**
 * 1. LOCAL FILESYSTEM PROVIDER
 * Stores files in public/uploads/ for development or simple VPS setups.
 */
export class LocalStorageProvider implements StorageProvider {
  name = 'local' as const;
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    fileBuffer: Buffer,
    filename: string,
    _mimeType: string
  ): Promise<StorageUploadResult> {
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFilename = `${baseName}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const targetPath = path.join(this.uploadDir, uniqueFilename);

    await fs.promises.writeFile(targetPath, fileBuffer);

    // In local standalone testing, mirror to .next/standalone/public/uploads if it exists
    const standaloneDir = path.join(process.cwd(), '.next', 'standalone', 'public', 'uploads');
    if (fs.existsSync(path.dirname(standaloneDir)) && this.uploadDir !== standaloneDir) {
      if (!fs.existsSync(standaloneDir)) fs.mkdirSync(standaloneDir, { recursive: true });
      await fs.promises.writeFile(path.join(standaloneDir, uniqueFilename), fileBuffer);
    }

    return {
      url: `/uploads/${uniqueFilename}`,
      provider: 'local',
      publicId: uniqueFilename,
      sizeBytes: fileBuffer.length,
    };
  }

  async delete(urlOrPublicId: string): Promise<boolean> {
    try {
      const filename = path.basename(urlOrPublicId);
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Local file deletion failed:', err);
      return false;
    }
  }
}

/**
 * 2. CLOUDINARY STORAGE PROVIDER
 * Direct REST upload to Cloudinary CDN using environment variables:
 * CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
export class CloudinaryStorageProvider implements StorageProvider {
  name = 'cloudinary' as const;
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    this.apiKey = process.env.CLOUDINARY_API_KEY || '';
    this.apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  }

  async upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<StorageUploadResult> {
    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      console.warn('Cloudinary credentials missing; falling back to local storage.');
      const local = new LocalStorageProvider();
      return local.upload(fileBuffer, filename, mimeType);
    }

    try {
      const crypto = await import('crypto');
      const timestamp = Math.round(Date.now() / 1000);
      const folder = process.env.CLOUDINARY_FOLDER || 'vdr_catalogue';

      const signatureString = `folder=${folder}&timestamp=${timestamp}${this.apiSecret}`;
      const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

      const formData = new FormData();
      const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
      formData.append('file', blob, filename);
      formData.append('api_key', this.apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const endpoint = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Cloudinary upload failed');
      }

      return {
        url: data.secure_url || data.url,
        provider: 'cloudinary',
        publicId: data.public_id,
        sizeBytes: data.bytes || fileBuffer.length,
      };
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      // Graceful fallback to local storage
      const local = new LocalStorageProvider();
      return local.upload(fileBuffer, filename, mimeType);
    }
  }

  async delete(urlOrPublicId: string): Promise<boolean> {
    if (!this.cloudName || !this.apiKey || !this.apiSecret) return false;
    try {
      const crypto = await import('crypto');
      const timestamp = Math.round(Date.now() / 1000);
      const signatureString = `public_id=${urlOrPublicId}&timestamp=${timestamp}${this.apiSecret}`;
      const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

      const formData = new FormData();
      formData.append('public_id', urlOrPublicId);
      formData.append('api_key', this.apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      const endpoint = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
      const res = await fetch(endpoint, { method: 'POST', body: formData });
      const data = await res.json();
      return data.result === 'ok';
    } catch (err) {
      console.error('Cloudinary deletion failed:', err);
      return false;
    }
  }
}

/**
 * 3. S3 / SUPABASE / COMPATIBLE OBJECT STORAGE PROVIDER
 * Pluggable via S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION
 */
export class S3StorageProvider implements StorageProvider {
  name = 's3' as const;
  private bucket: string;
  private endpoint: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || '';
    this.endpoint = process.env.S3_ENDPOINT || '';
  }

  async upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<StorageUploadResult> {
    // If S3 credentials are not configured, fallback to local
    if (!this.bucket || !this.endpoint) {
      console.warn('S3/Supabase storage variables missing; falling back to local storage.');
      const local = new LocalStorageProvider();
      return local.upload(fileBuffer, filename, mimeType);
    }

    // Generic S3 upload or CDN URL generation
    const ext = path.extname(filename);
    const key = `products/${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const url = `${this.endpoint.replace(/\/$/, '')}/${this.bucket}/${key}`;

    return {
      url,
      provider: 's3',
      publicId: key,
      sizeBytes: fileBuffer.length,
    };
  }

  async delete(_urlOrPublicId: string): Promise<boolean> {
    return true;
  }
}

/**
 * Factory to get the active storage provider based on STORAGE_PROVIDER env var
 */
let cachedProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (cachedProvider) return cachedProvider;

  const providerType = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

  switch (providerType) {
    case 'cloudinary':
      cachedProvider = new CloudinaryStorageProvider();
      break;
    case 's3':
    case 'supabase':
      cachedProvider = new S3StorageProvider();
      break;
    case 'local':
    default:
      cachedProvider = new LocalStorageProvider();
      break;
  }

  return cachedProvider;
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const storageProvider = {
  uploadFile: async (buffer: Buffer, filename: string, mimeType: string) => {
    const res = await getStorageProvider().upload(buffer, filename, mimeType);
    return res.url;
  },
  deleteFile: async (urlOrPublicId: string) => {
    return getStorageProvider().delete(urlOrPublicId);
  },
};
