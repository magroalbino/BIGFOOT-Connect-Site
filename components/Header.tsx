// components/Header.tsx
export default function Header() {
    return (
        <header className="bg-card shadow-md px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="BIGFOOT Connect" className="h-8" />
                <span className="text-primary font-bold text-xl">BIGFOOT Connect</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm">Hey! 👋 Yan Leite</span>
                <button className="bg-primary text-white px-3 py-1 rounded hover:bg-opacity-80 transition">
                    Sair
                </button>
            </div>
        </header>
    );
}

// components/Header.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import AuthButton from './AuthButton';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="sticky top-0 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          BIGFOOT Connect
        </Link>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <div className={`md:flex items-center space-x-4 ${isOpen ? 'block' : 'hidden'} md:block`}>
          <Link href="/dashboard" className="block p-2 hover:text-blue-600">Dashboard</Link>
          <Link href="/pairing" className="block p-2 hover:text-blue-600">Pareamento</Link>
          <AuthButton />
        </div>
      </nav>
    </header>
  );
}
