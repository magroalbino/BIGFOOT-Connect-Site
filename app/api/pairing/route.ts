import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Schema de validação para o código de pareamento (XXXX-XXXX)
const pairingSchema = z.object({
  code: z.string().regex(/^\d{4}-\d{4}$/, 'Código deve ter o formato XXXX-XXXX'),
});

export async function GET() {
  try {
    // Verifica autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Busca pareamentos do usuário
    const pairings = await prisma.pairing.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        code: true,
        createdAt: true,
        deviceName: true, // Opcional, se existir no schema
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
    // Verifica autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Valida o corpo da requisição
    const body = await req.json();
    const { code } = pairingSchema.parse(body);

    // Verifica se o código existe e é válido
    const existingPairing = await prisma.pairing.findUnique({
      where: { code },
    });

    if (!existingPairing) {
      return NextResponse.json({ error: 'Código inválido ou expirado' }, { status: 400 });
    }

    if (existingPairing.userId) {
      return NextResponse.json({ error: 'Código já pareado' }, { status: 400 });
    }

    // Atualiza o pareamento com o usuário
    const pairing = await prisma.pairing.update({
      where: { code },
      data: {
        userId: session.user.id,
        deviceName: body.deviceName || 'Dispositivo Desconhecido', // Opcional
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
