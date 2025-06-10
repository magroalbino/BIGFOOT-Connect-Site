// API de pareamento (POST/GET)
import { NextResponse } from 'next/server';

export async function GET() {
  // Código de pareamento gerado (mock)
  const code = 'BIG123';
  return NextResponse.json({ code });
}

export async function POST(request: Request) {
  const data = await request.json();

  // Aqui você pode salvar no banco ou processar os dados
  return NextResponse.json({
    success: true,
    received: data,
    code: 'BIG123',
  });
}