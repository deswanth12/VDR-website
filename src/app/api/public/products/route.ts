// src/app/api/public/products/route.ts
import { NextResponse } from 'next/server';
import { getPublicProducts } from '@/lib/db/queries';

export async function GET() {
  try {
    const products = await getPublicProducts();
    return NextResponse.json({ products });
  } catch (err: any) {
    console.error('Error in public products API:', err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
