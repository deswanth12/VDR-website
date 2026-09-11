// src/app/api/admin/enquiries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { enquiries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
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
    const { status, internalNotes } = body;

    const validStatuses = ['new', 'contacted', 'follow-up', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const updateFields: any = { updatedAt: now };
    if (status) updateFields.status = status;
    if (internalNotes !== undefined) updateFields.internalNotes = internalNotes;

    await db.update(enquiries).set(updateFields).where(eq(enquiries.id, id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Failed to update enquiry:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update enquiry.' },
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
  await db.delete(enquiries).where(eq(enquiries.id, id)).run();
  return NextResponse.json({ success: true, message: 'Enquiry deleted successfully.' });
}
