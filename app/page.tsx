// app/page.tsx
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
    redirect('/dashboard');
    return null;
}

// app/page.tsx
export default function Home() {
  return (
    <section className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Ganhe com Sua Internet Ociosa</h1>
        <p className="text-lg md:text-xl mb-6">Compartilhe sua banda e receba recompensas com BIGFOOT Connect.</p>
        <a href="/dashboard" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">
          Comece Agora
        </a>
      </div>
    </section>
  );
}
