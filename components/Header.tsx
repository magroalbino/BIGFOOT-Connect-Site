'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const userName = session?.user?.name || 'Usuário';

  return (
    <header className="sticky top-0 bg-black/90 backdrop-blur-md shadow-md z-10">
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
          <span className="text-2xl font-bold text-green-400">BIGFOOT Connect</span>
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            className="p-2 text-yellow-400"
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

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          className={`md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-black/90 md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 overflow-hidden transition-all duration-300`}
        >
          <Link
            href="/dashboard"
            className="block p-2 text-yellow-400 hover:text-green-400 md:p-0 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/pairing"
            className="block p-2 text-yellow-400 hover:text-green-400 md:p-0 transition-colors"
          >
            Pareamento
          </Link>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {status === 'loading' ? (
              <span className="text-sm text-gray-400">Carregando...</span>
            ) : session ? (
              <>
                <span className="text-sm text-yellow-400">Hey! 👋 {userName}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-green-400 text-black px-3 py-1 rounded-md hover:bg-yellow-400 transition-colors"
                  aria-label="Sair da conta"
                >
                  Sair
                </motion.button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-green-400 text-black px-3 py-1 rounded-md hover:bg-yellow-400 transition-colors"
                aria-label="Entrar na conta"
              >
                Entrar
              </Link>
            )}
          </div>
        </motion.div>
      </nav>
    </header>
  );
}
