import './globals.css';
import { ReactNode } from 'react';
import AuthButton from '@/components/AuthButton';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white min-h-screen flex flex-col">
        <header className="bg-green-400 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">BIGFOOT Connect</h1>
          <AuthButton />
        </header>
        <main className="flex-grow flex items-center justify-center p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
