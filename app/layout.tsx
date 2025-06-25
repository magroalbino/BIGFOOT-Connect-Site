// layout.tsx

import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Export separado para viewport — CORRETO
export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata = {
  title: 'BIGFOOT Connect - Compartilhe Banda, Ganhe Recompensas',
  description:
    'Ganhe recompensas compartilhando sua banda ociosa com a extensão BIGFOOT Connect. Seguro, escalável e fácil de usar.',
  openGraph: {
    title: 'BIGFOOT Connect',
    description: 'Compartilhe sua internet ociosa e receba tokens BFT.',
    url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
};
