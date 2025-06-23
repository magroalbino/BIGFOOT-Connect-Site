// lib/auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from './prisma';
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Ex.: GoogleProvider({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);// Configuração do NextAuth
