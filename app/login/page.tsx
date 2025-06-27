'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            window.location.href = '/dashboard'; // Redireciona para o dashboard após login
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-black/10 backdrop-blur-md rounded-xl shadow-lg animate-fadeIn">
                {/* Imagem na parte superior central */}
                <div className="flex justify-center mb-8">
                    <Image
                        src="/bigfoot-minimal.png" // Substitua pelo nome da sua imagem minimalista em public/
                        alt="BIGFOOT Connect Minimal Logo"
                        width={200}
                        height={100}
                        className="object-contain animate-bounce"
                    />
                </div>
                <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">BIGFOOT Connect</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-green-400 mb-1">Usuário</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 bg-white/20 rounded-md text-yellow-400 focus:outline-none focus:bg-white/30 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-green-400 mb-1">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 bg-white/20 rounded-md text-yellow-400 focus:outline-none focus:bg-white/30 transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-green-400 text-black rounded-md hover:bg-yellow-400 hover:scale-105 transition-all"
                    >
                        Entrar
                    </button>
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    <p className="text-center text-yellow-400 hover:text-green-400 transition-colors">
                        <a href="/register">Não tem conta? Registre-se</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

// Animações
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-fadeIn {
    animation: fadeIn 1s ease-in-out;
  }
  .animate-bounce {
    animation: bounce 2s infinite;
  }
`;

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);
document.adoptedStyleSheets = [styleSheet];