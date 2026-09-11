// src/app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storageProvider, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/storage';
import { getCurrentAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload JPEG, PNG, or WebP.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File exceeds maximum 5MB size limit.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileUrl = await storageProvider.uploadFile(buffer, file.name, file.type);

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to upload image.' },
      { status: 500 }
    );
  }
}
