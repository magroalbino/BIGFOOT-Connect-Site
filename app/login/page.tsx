'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
  .animate-bounce {
    animation: bounce 2s infinite ease-in-out;
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Credenciais inválidas');
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-black/30 backdrop-blur-lg rounded-xl shadow-xl animate-fadeIn">
          <div className="flex justify-center mb-6">
            <Image
              src="/bigfoot-minimal.png"
              alt="BIGFOOT Connect Minimal Logo"
              width={180}
              height={90}
              className="object-contain animate-bounce"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">BIGFOOT Connect</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-yellow-400">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 bg-white/10 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-yellow-400">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 bg-white/10 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                placeholder="********"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full p-3 bg-green-400 text-black font-semibold rounded-md hover:bg-yellow-400 hover:scale-105 transition-all duration-200"
            >
              Entrar
            </button>
            <p className="text-center text-yellow-400 text-sm mt-4">
              Não tem conta?{' '}
              <Link href="/register" className="hover:text-green-400 transition-colors">
                Registre-se
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
