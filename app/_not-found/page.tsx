// app/_not-found/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function NotFoundPage() {
    // Busca sessão no servidor
    const session = await getServerSession(authOptions);

    return (
        <main style={{ padding: "2rem", textAlign: "center" }}>
            <h1>404 - Página Não Encontrada</h1>

            {session ? (
                <>
                    <p>Olá, {session.user?.name ?? session.user?.email}! Parece que essa página não existe.</p>
                    <p>Verifique a URL ou retorne para a página inicial.</p>
                </>
            ) : (
                <>
                    <p>Você não está logado. Essa página não foi encontrada.</p>
                    <p>Por favor, faça login ou volte para a página inicial.</p>
                </>
            )}

            <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
                Voltar para Home
            </a>
        </main>
    );
}
