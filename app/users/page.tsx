'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type User = {
    id: number
    username: string
    password: string
    createdAt: string // ou Date se preferir
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        async function fetchUsers() {
            const { data, error } = await supabase.from('users').select('*')

            if (error) {
                console.error('Erro ao buscar usuários:', error)
            } else if (data) {
                setUsers(data)
            }
        }

        fetchUsers()
    }, [])

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Usuários</h1>
            <ul className="mt-4">
                {users.map((user) => (
                    <li key={user.id} className="py-1">{user.username}</li>
                ))}
            </ul>
        </div>
    )
}
