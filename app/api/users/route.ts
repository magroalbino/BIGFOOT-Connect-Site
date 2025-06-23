// app/api/users/route.ts
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase.from('users').select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// app/api/user/route.ts
export async function GET() {
  const user = await prisma.user.findMany();
  return Response.json(user, { headers: { 'Cache-Control': 's-maxage=3600' } });
}
