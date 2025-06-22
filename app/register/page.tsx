// app/register/page.tsx
'use client'

import { useState } from 'react'

export default function RegisterPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')

    const handleRegister = async () => {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        const data = await res.json()
        if (res.ok) {
            setStatus('Usuário registrado com sucesso!')
        } else {
            setStatus(data.error || 'Erro ao registrar usuário.')
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Cadastro</h1>
            <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block border p-2 my-2"
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block border p-2 my-2"
            />
            <button onClick={handleRegister} className="bg-blue-600 text-white px-4 py-2">
                Cadastrar
            </button>
            {status && <p className="mt-4">{status}</p>}
        </div>
    )
}
