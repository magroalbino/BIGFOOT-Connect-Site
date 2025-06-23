// app/layout.tsx
import './globals.css';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export const metadata = {
    title: 'BIGFOOT Connect',
    description: 'Dashboard para acompanhar earnings e pareamento',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <head />
            <body className="flex min-h-screen bg-background text-white font-sans">
                <Sidebar />
                <div className="flex-1">
                    <Header />
                    <main className="p-6">{children}</main>
                </div>
            </body>
        </html>
    );
}

// app/layout.tsx
export const metadata = {
  title: 'BIGFOOT Connect - Compartilhe Banda, Ganhe Recompensas',
  description: 'Ganhe recompensas compartilhando sua banda ociosa com a extensão BIGFOOT Connect. Seguro, escalável e fácil de usar.',
  openGraph: {
    title: 'BIGFOOT Connect',
    description: 'Compartilhe sua internet ociosa e receba tokens BFT.',
    images: ['/og-image.png'],
  },
};
