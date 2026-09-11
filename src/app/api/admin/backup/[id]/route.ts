// src/app/api/admin/backup/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { getSnapshotFilePath, deleteSnapshot } from '@/lib/backup';
import fs from 'fs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const filePath = getSnapshotFilePath(id);

  if (!filePath || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Snapshot file not found' }, { status: 404 });
  }

  const fileBuffer = await fs.promises.readFile(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-sqlite3',
      'Content-Disposition': `attachment; filename="${id}.db"`,
    },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const success = await deleteSnapshot(id);

  if (!success) {
    return NextResponse.json({ error: 'Failed to delete snapshot' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Snapshot deleted' });
}
