// app/pairing/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { generatePairingCode } from '@/utils/pairing';
import ClientPairingPage from './clientpairingpage';

export const metadata = {
  title: 'Pareamento - BIGFOOT Connect',
  description: 'Conecte sua extensão ao BIGFOOT Connect escaneando o QR Code ou inserindo o código de pareamento.',
  openGraph: {
    title: 'Pareamento - BIGFOOT Connect',
    description: 'Conecte sua extensão para compartilhar banda ociosa e ganhar recompensas.',
    url: process.env.NEXT_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_URL}/pairing`
      : 'http://localhost:3000/pairing',
    images: [{ url: '/og-image.png' }],
  },
};

export const dynamic = 'force-dynamic';

export default async function PairingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const pairingCode = generatePairingCode();

  return <ClientPairingPage pairingCode={pairingCode} />;
}
