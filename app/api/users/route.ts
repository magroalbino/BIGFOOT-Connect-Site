import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { User } from '@prisma/client';

// Protege a rota para usuários autenticados e admin (exemplo)
export async function GET() {
  try {
    // Verifica autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Opcional: verifica se é admin (ajuste conforme seu schema)
    // if (!session.user.isAdmin) {
    //   return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    // }

    // Busca usuários, selecionando apenas campos seguros
    const users: Pick<User, 'id' | 'name' | 'email'>[] = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        // Exclui campos sensíveis como password
      },
    });

    if (!users.length) {
      return NextResponse.json({ message: 'Nenhum usuário encontrado' }, { status: 200 });
    }

    // Configura cache (1 hora)
    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
