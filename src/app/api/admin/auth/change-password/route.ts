// src/app/api/admin/auth/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin, verifyPassword, hashPassword, revokeAdminSessions } from '@/lib/auth';
import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Verify current password against database
    const adminRecord = await db
      .select()
      .from(admins)
      .where(eq(admins.id, currentAdmin.id))
      .get();

    if (!adminRecord) {
      return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
    }

    const isValid = await verifyPassword(currentPassword, adminRecord.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password does not match our records.' },
        { status: 403 }
      );
    }

    // Hash new password and update
    const newHash = await hashPassword(newPassword);
    const now = new Date().toISOString();

    await db
      .update(admins)
      .set({
        passwordHash: newHash,
        updatedAt: now,
      })
      .where(eq(admins.id, currentAdmin.id));

    return NextResponse.json({
      success: true,
      message: 'Admin password updated successfully.',
    });
  } catch (err: any) {
    console.error('Password change error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}
