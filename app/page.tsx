import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Verifique se o caminho está correto

// Força renderização dinâmica devido ao uso de getServerSession
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      redirect('/login'); // Certifique-se de que app/login/page.tsx existe
    }

    // Exemplo de conteúdo do dashboard
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Bem-vindo ao Dashboard</h1>
          <p className="text-lg text-gray-700">
            Aqui você pode gerenciar seu compartilhamento de banda com BIGFOOT Connect.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    // Fallback para evitar erro 500
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">Erro ao carregar o dashboard. Tente novamente mais tarde.</p>
      </div>
    );
  }
}
