import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Ajuste o caminho conforme sua estrutura

export const metadata = {
  title: 'BIGFOOT Connect - Compartilhe Banda, Ganhe Recompensas',
  description:
    'Ganhe recompensas compartilhando sua banda ociosa com a extensão BIGFOOT Connect. Seguro, escalável e fácil de usar.',
  openGraph: {
    title: 'BIGFOOT Connect',
    description: 'Compartilhe sua internet ociosa e receba tokens BFT.',
    url: 'https://seusite.com', // Substitua pelo seu domínio
    images: [{ url: '/og-image.png' }], // Adicione uma imagem em public/
  },
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Verifica se o usuário está autenticado
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Ganhe com Sua Internet Ociosa
        </h1>
        <p className="text-lg md:text-xl mb-6 leading-relaxed">
          Compartilhe sua banda e receba recompensas com BIGFOOT Connect.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          aria-label="Comece a usar o BIGFOOT Connect"
        >
          Comece Agora
        </Link>
      </div>
    </section>
  );
}
