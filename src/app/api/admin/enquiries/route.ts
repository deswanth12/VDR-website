// src/app/api/admin/enquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminEnquiriesList } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;

  const list = await getAdminEnquiriesList(status, search);
  return NextResponse.json({ enquiries: list });
}
