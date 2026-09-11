// src/app/api/admin/brands/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { brands, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const { name, tagline, description, categoryTag, highlights, logoUrl, isActive, sortOrder } =
      body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Brand name is required.' }, { status: 400 });
    }

    const now = new Date().toISOString();

    await db
      .update(brands)
      .set({
        name: name.trim(),
        tagline: tagline || null,
        description: description || null,
        categoryTag: categoryTag || null,
        highlightsJson: Array.isArray(highlights) ? JSON.stringify(highlights) : null,
        logoUrl: logoUrl || null,
        isActive: isActive !== undefined ? (isActive ? 1 : 0) : 1,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        updatedAt: now,
      })
      .where(eq(brands.id, id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Failed to update brand:', err);
    return NextResponse.json({ error: err.message || 'Failed to update brand.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const attachedProducts = await db.select().from(products).where(eq(products.brandId, id)).all();

  if (attachedProducts.length > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete brand: ${attachedProducts.length} product(s) still belong to this brand. Please reassign or delete them first.`,
      },
      { status: 400 }
    );
  }

  await db.delete(brands).where(eq(brands.id, id)).run();
  return NextResponse.json({ success: true, message: 'Brand deleted successfully.' });
}
