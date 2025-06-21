// app/api/ping-db/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json({ ok: true, count: users.length })
  } catch (error) {
    console.error('[PING_DB_ERROR]', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
