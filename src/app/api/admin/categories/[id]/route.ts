// src/app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { categories, products } from '@/lib/db/schema';
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
    const { name, description, icon, isActive, sortOrder } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const now = new Date().toISOString();

    await db
      .update(categories)
      .set({
        name: name.trim(),
        description: description || null,
        icon: icon || null,
        isActive: isActive !== undefined ? (isActive ? 1 : 0) : 1,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        updatedAt: now,
      })
      .where(eq(categories.id, id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Failed to update category:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update category.' },
      { status: 500 }
    );
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

  // Safe check: verify no products are attached
  const attachedProducts = await db
    .select()
    .from(products)
    .where(eq(products.categoryId, id))
    .all();

  if (attachedProducts.length > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete category: ${attachedProducts.length} product(s) still belong to this category. Please reassign or delete them first.`,
      },
      { status: 400 }
    );
  }

  await db.delete(categories).where(eq(categories.id, id)).run();
  return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
}
