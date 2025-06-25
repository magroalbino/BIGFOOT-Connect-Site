// app/_not-found/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
    title: "Página não encontrada",
};

export default async function NotFoundPage() {
    const session = await getServerSession(authOptions);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>

            {session ? (
                <p className="mb-4">Olá, {session.user?.name || session.user?.email}! A página que você procurou não existe.</p>
            ) : (
                <p className="mb-4">Você não está logado. A página que você procurou não existe.</p>
            )}

            <Link href="/" className="text-blue-500 underline">
                Voltar para a página inicial
            </Link>
        </main>
    );
}
