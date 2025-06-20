// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { userId, password } = await req.json();

  if (!userId || !password) {
    return NextResponse.json({ error: 'ID e senha são obrigatórios' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { userId } });

  if (existingUser) {
    return NextResponse.json({ error: 'Usuário já existe' }, { status: 409 });
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      userId,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ success: true, user: { id: newUser.id, userId: newUser.userId } });
}
