// app/api/pairing/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Validação do código de pareamento
const pairingSchema = z.object({
  code: z.string().regex(/^\d{4}-\d{4}$/, 'Código deve ter o formato XXXX-XXXX'),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || typeof session.user.id !== 'number') {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const pairings = await prisma.pairing.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        code: true,
        createdAt: true,
        deviceName: true,
      },
    });

    return NextResponse.json(pairings, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate' },
    });
  } catch (error) {
    console.error('Erro ao buscar pareamentos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || typeof session.user.id !== 'number') {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { code } = pairingSchema.parse(body);

    const existingPairing = await prisma.pairing.findUnique({
      where: { code },
    });

    if (!existingPairing) {
      return NextResponse.json({ error: 'Código inválido ou expirado' }, { status: 400 });
    }

    if (existingPairing.userId) {
      return NextResponse.json({ error: 'Código já pareado' }, { status: 400 });
    }

    const pairing = await prisma.pairing.update({
      where: { code },
      data: {
        userId: session.user.id,
        deviceName: body.deviceName || 'Dispositivo Desconhecido',
      },
      select: {
        id: true,
        code: true,
        createdAt: true,
        deviceName: true,
      },
    });

    return NextResponse.json({ success: true, pairing }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Erro ao processar pareamento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
