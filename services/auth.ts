// services/auth.ts
import prisma from '../lib/prisma';
export async function validateUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
