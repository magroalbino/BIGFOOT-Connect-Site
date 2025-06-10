// API de pareamento (POST/GET)
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Pairing GET OK' })
}

export async function POST() {
  return NextResponse.json({ message: 'Pairing POST OK' })
}