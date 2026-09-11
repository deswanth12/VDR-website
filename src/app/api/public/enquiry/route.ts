// src/app/api/public/enquiry/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPublicEnquiry } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, whatsappNumber, productId, productName, inquiryType, message, source } =
      body;

    if (!customerName || !phone) {
      return NextResponse.json(
        { error: 'Customer name and phone number are required.' },
        { status: 400 }
      );
    }

    await createPublicEnquiry({
      customerName: customerName.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber ? whatsappNumber.trim() : phone.trim(),
      productId,
      productName,
      inquiryType,
      message,
      source: source || 'website_contact_form',
    });

    return NextResponse.json({ success: true, message: 'Enquiry received successfully.' });
  } catch (err: any) {
    console.error('Error logging public enquiry:', err);
    return NextResponse.json(
      { error: 'Failed to record enquiry.' },
      { status: 500 }
    );
  }
}
