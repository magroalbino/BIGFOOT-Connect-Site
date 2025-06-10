// API de pareamento (POST/GET)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ code: 'BIG123' });
}

export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json({ success: true, received: data });
}