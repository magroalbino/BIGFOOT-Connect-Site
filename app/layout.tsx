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
