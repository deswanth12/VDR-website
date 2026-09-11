// src/app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminCategoriesList } from '@/lib/db/queries';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const list = await getAdminCategoriesList();
  return NextResponse.json({ categories: list });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, icon } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const now = new Date().toISOString();

    await db.insert(categories).values({
      id: cleanSlug,
      name: name.trim(),
      slug: cleanSlug,
      description: description || null,
      icon: icon || null,
      isActive: 1,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ success: true, id: cleanSlug });
  } catch (err: any) {
    console.error('Failed to create category:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create category.' },
      { status: 500 }
    );
  }
}
