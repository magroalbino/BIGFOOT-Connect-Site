// app/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Certifique-se de que este caminho está correto

// Metadados para SEO
export const metadata = {
  title: 'BIGFOOT Connect - Compartilhe Banda, Ganhe Recompensas',
  description:
    'Ganhe recompensas compartilhando sua banda ociosa com a extensão BIGFOOT Connect. Seguro, escalável e fácil de usar.',
  openGraph: {
    title: 'BIGFOOT Connect',
    description: 'Compartilhe sua internet ociosa e receba tokens BIG.',
    url: process.env.NEXT_PUBLIC_URL || 'https://seusite.com', // Usa variável de ambiente
    images: [{ url: '/og-image.png' }], // Verifique se existe em public/
  },
};

// Força renderização dinâmica para verificar sessão
export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    // Verifica se o usuário está autenticado
    const session = await getServerSession(authOptions);
    if (session?.user) {
      redirect('/dashboard');
    }
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    // Fallback: continua renderizando a página em caso de erro
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
          Ganhe com Sua Internet Ociosa
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 leading-relaxed">
          Compartilhe sua banda e receba recompensas com BIGFOOT Connect.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
          aria-label="Comece a usar o BIGFOOT Connect"
        >
          Comece Agora
        </Link>
      </div>
    </section>
  );
}
