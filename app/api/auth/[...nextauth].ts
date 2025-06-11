// Rota de autenticação NextAuth

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "NextAuth route not yet implemented." });
}

export async function POST() {
  return NextResponse.json({ message: "NextAuth POST route placeholder." });
}