'use client';
import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  // Nome do usuário ou fallback
  const userName = session?.user?.name || 'Usuário';

  return (
    <header className="sticky top-0 bg-white shadow-md z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2" aria-label="BIGFOOT Connect Home">
          <Image
            src="/logo.svg"
            alt="BIGFOOT Connect Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="text-2xl font-bold text-blue-600">BIGFOOT Connect</span>
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            className="p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 transition-all duration-200`}
        >
          <Link
            href="/dashboard"
            className="block p-2 text-gray-700 hover:text-blue-600 md:p-0"
            aria-current={isOpen ? 'page' : undefined}
          >
            Dashboard
          </Link>
          <Link
            href="/pairing"
            className="block p-2 text-gray-700 hover:text-blue-600 md:p-0"
            aria-current={isOpen ? 'page' : undefined}
          >
            Pareamento
          </Link>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {status === 'loading' ? (
              <span className="text-sm text-gray-500">Carregando...</span>
            ) : session ? (
              <>
                <span className="text-sm text-gray-700">Hey! 👋 {userName}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors duration-200"
                  aria-label="Sair da conta"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors duration-200"
                aria-label="Entrar na conta"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
