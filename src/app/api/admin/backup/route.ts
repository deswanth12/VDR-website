// src/app/api/admin/backup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { getDatabaseStats, listSnapshots, createSnapshot } from '@/lib/backup';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [stats, snapshots] = await Promise.all([
      getDatabaseStats(),
      listSnapshots(),
    ]);

    return NextResponse.json({
      success: true,
      stats,
      snapshots,
    });
  } catch (err: any) {
    console.error('Backup fetch error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch backup status.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const name = body?.name;

    const snapshot = await createSnapshot(name);

    return NextResponse.json({
      success: true,
      snapshot,
    });
  } catch (err: any) {
    console.error('Snapshot creation error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create snapshot.' }, { status: 500 });
  }
}
