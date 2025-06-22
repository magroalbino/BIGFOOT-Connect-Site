import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'  // Verifique se o client está atualizado

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return NextResponse.json(
        { error: 'Username e senha são obrigatórios e devem ser strings' },
        { status: 400 }
      )
    }

    // Busca usuário existente pelo username (campo único no schema)
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Usuário já existe' }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, username: newUser.username },
    })
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno ao registrar usuário' },
      { status: 500 }
    )
  }
}
