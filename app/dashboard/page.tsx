'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    totalShares: 0,
    weeklyShares: 0,
    connections: 0,
    weeklyData: [0, 0, 0, 0, 0, 0, 0], // Dados para o gráfico
  });

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchStats = async () => {
        try {
          const response = await fetch('/api/user');
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (error) {
          console.error('Erro ao buscar estatísticas:', error);
        }
      };
      fetchStats();
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-black flex items-center justify-center">
        <p className="text-white text-lg">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-black flex items-center justify-center">
        <p className="text-white text-lg">Faça login para acessar o dashboard.</p>
      </div>
    );
  }

  const chartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Compartilhamentos',
        data: stats.weeklyData,
        backgroundColor: 'rgba(110, 231, 183, 0.8)', // Verde-claro
        borderColor: '#000000', // Preto
        borderWidth: 1,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-black mb-6">
          Bem-vindo, {session.user?.name || 'Usuário'}!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card title="Total de Compartilhamentos" value={stats.totalShares.toString()} />
          <Card title="Compartilhamentos Semanais" value={stats.weeklyShares.toString()} />
          <Card title="Conexões" value={stats.connections.toString()} status />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-black mb-4">Atividade Semanal</h2>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { labels: { color: '#000000' } } },
              scales: {
                x: { ticks: { color: '#000000' } },
                y: { ticks: { color: '#000000' } },
              },
            }}
          />
        </motion.div>
        <div className="mt-6 text-center">
          <Link href="/pairing" className="text-green-400 hover:text-yellow-400 transition-colors">
            Parear com Extensão
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

function Card({ title, value, status = false }: { title: string; value: string; status?: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg text-center"
    >
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className={`text-2xl font-bold ${status ? 'text-green-400' : 'text-yellow-400'}`}>
        {value}
      </p>
    </motion.div>
  );
}
