// src/app/api/admin/backup/restore/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { restoreSnapshot } from '@/lib/backup';

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { snapshotId } = await req.json();

    if (!snapshotId) {
      return NextResponse.json({ error: 'Snapshot ID is required.' }, { status: 400 });
    }

    const result = await restoreSnapshot(snapshotId);

    return NextResponse.json({
      success: true,
      message: 'Database successfully restored from snapshot.',
      safetyBackupId: result.safetyBackupId,
      restoredProducts: result.restoredProducts,
    });
  } catch (err: any) {
    console.error('Restore error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to restore snapshot.' },
      { status: 500 }
    );
  }
}
