// API de dados do usuário
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Rota de usuário funcionando' })
}