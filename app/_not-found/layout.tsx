// app/_not-found/layout.tsx

export default function NotFoundLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <head />
            <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#f7f7f7', color: '#111' }}>
                {children}
            </body>
        </html>
    );
}
