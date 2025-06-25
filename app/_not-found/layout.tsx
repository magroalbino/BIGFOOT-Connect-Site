// app/_not-found/layout.tsx
export const metadata = {
    title: 'Página não encontrada',
};

export default function NotFoundLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>
                {children}
            </body>
        </html>
    );
}
