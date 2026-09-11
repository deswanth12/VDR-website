// src/app/uploads/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;

  // Sanitize filename to prevent directory traversal
  const safeFilename = path.basename(filename);
  if (!safeFilename || safeFilename.startsWith('.')) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const uploadDir = process.env.UPLOADS_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, safeFilename);

  // Fallback to standalone public directory if needed
  const fallbackPath = path.join(/*turbopackIgnore: true*/ process.cwd(), '.next', 'standalone', 'public', 'uploads', safeFilename);

  let targetPath = filePath;
  if (!fs.existsSync(targetPath) && fs.existsSync(fallbackPath)) {
    targetPath = fallbackPath;
  }

  if (!fs.existsSync(targetPath)) {
    return new NextResponse('Image not found', { status: 404 });
  }

  try {
    const fileBuffer = await fs.promises.readFile(targetPath);
    const ext = path.extname(safeFilename).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Error serving upload image:', err);
    return new NextResponse('Error reading image', { status: 500 });
  }
}
