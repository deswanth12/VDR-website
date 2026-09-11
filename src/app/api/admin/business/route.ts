// src/app/api/admin/business/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { businessInfo } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db.select().from(businessInfo).all();
  const map: Record<string, string> = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }

  return NextResponse.json({ businessInfo: map });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const now = new Date().toISOString();

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        const exists = await db.select().from(businessInfo).where(eq(businessInfo.key, key)).get();
        if (exists) {
          await db
            .update(businessInfo)
            .set({ value, updatedAt: now })
            .where(eq(businessInfo.key, key));
        } else {
          await db.insert(businessInfo).values({ key, value, updatedAt: now });
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Business information updated.' });
  } catch (err: any) {
    console.error('Failed to update business info:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update business info.' },
      { status: 500 }
    );
  }
}
