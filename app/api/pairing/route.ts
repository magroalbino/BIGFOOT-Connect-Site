// API de pareamento (POST/GET)
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Pairing GET OK' })
}

export async function POST() {
  return NextResponse.json({ message: 'Pairing POST OK' })
}

// app/api/pairing/route.ts
import { z } from 'zod';
const pairingSchema = z.object({ code: z.string().length(8) });
export async function POST(req: Request) {
  const body = await req.json();
  const { code } = pairingSchema.parse(body);
  // Lógica de pareamento
  return Response.json({ success: true });
}
