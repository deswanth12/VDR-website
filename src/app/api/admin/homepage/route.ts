// src/app/api/admin/homepage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { homepageContent } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db.select().from(homepageContent).all();
  const sections: Record<string, any> = {};
  for (const r of rows) {
    try {
      sections[r.sectionKey] = JSON.parse(r.contentJson);
    } catch {
      sections[r.sectionKey] = r.contentJson;
    }
  }

  return NextResponse.json({ sections });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { sectionKey, content } = body;

    if (!sectionKey || !content) {
      return NextResponse.json(
        { error: 'sectionKey and content are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const contentJson = JSON.stringify(content);

    const exists = await db
      .select()
      .from(homepageContent)
      .where(eq(homepageContent.sectionKey, sectionKey))
      .get();

    if (exists) {
      await db
        .update(homepageContent)
        .set({ contentJson, updatedAt: now })
        .where(eq(homepageContent.sectionKey, sectionKey));
    } else {
      await db.insert(homepageContent).values({
        sectionKey,
        contentJson,
        updatedAt: now,
      });
    }

    return NextResponse.json({ success: true, message: 'Homepage content updated.' });
  } catch (err: any) {
    console.error('Failed to update homepage content:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update homepage content.' },
      { status: 500 }
    );
  }
}
