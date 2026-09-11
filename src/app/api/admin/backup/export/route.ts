// src/app/api/admin/backup/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { exportFullJson } from '@/lib/backup';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'sqlite';
  const dateStr = new Date().toISOString().split('T')[0];

  if (format === 'json') {
    const jsonDump = await exportFullJson();
    const jsonString = JSON.stringify(jsonDump, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="vdr_catalogue_export_${dateStr}.json"`,
      },
    });
  }

  // SQLite Binary Format
  const dbPath = path.join(process.cwd(), 'data', 'vdr.db');
  if (!fs.existsSync(dbPath)) {
    return NextResponse.json({ error: 'Database file not found.' }, { status: 404 });
  }

  const fileBuffer = await fs.promises.readFile(dbPath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-sqlite3',
      'Content-Disposition': `attachment; filename="vdr_live_backup_${dateStr}.db"`,
    },
  });
}
