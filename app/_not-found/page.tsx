// app/_not-found/page.tsx
import Link from "next/link";

export const metadata = {
    title: "Página não encontrada",
};

export default function NotFoundPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
            <p className="mb-4">A página que você está tentando acessar não existe.</p>
            <Link href="/" className="text-blue-500 underline">
                Voltar para a página inicial
            </Link>
        </main>
    );
}
