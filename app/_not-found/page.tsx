// app/_not-found/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function NotFoundPage() {
    const session = await getServerSession(authOptions);

    return (
        <main style={{ padding: "2rem", textAlign: "center" }}>
            <h1>404 - Página Não Encontrada</h1>

            {session ? (
                <>
                    <p>Olá, {session.user?.name ?? session.user?.email}!</p>
                    <p>A página que você procura não foi encontrada.</p>
                </>
            ) : (
                <>
                    <p>Você não está logado.</p>
                    <p>Por favor, faça login para continuar.</p>
                </>
            )}

            <Link href="/">Voltar para Home</Link>
        </main>
    );
}
