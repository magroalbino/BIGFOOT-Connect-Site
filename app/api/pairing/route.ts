// API de pareamento (POST/GET)
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();

  // Aqui você poderia gerar um código, salvar no banco etc.
  return NextResponse.json({ code: 'ABC123', data });
}

export async function GET() {
  // Retorna código de pareamento mockado
  return NextResponse.json({ code: 'ABC123' });
}
