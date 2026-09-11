// src/app/api/admin/brands/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminBrandsList } from '@/lib/db/queries';
import { db } from '@/lib/db';
import { brands } from '@/lib/db/schema';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const list = await getAdminBrandsList();
  return NextResponse.json({ brands: list });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, tagline, description, categoryTag, highlights, logoUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Brand name is required.' }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const now = new Date().toISOString();

    await db.insert(brands).values({
      id: cleanSlug,
      name: name.trim(),
      slug: cleanSlug,
      tagline: tagline || null,
      description: description || null,
      categoryTag: categoryTag || null,
      highlightsJson: Array.isArray(highlights) ? JSON.stringify(highlights) : null,
      logoUrl: logoUrl || null,
      isActive: 1,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ success: true, id: cleanSlug });
  } catch (err: any) {
    console.error('Failed to create brand:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create brand.' },
      { status: 500 }
    );
  }
}
