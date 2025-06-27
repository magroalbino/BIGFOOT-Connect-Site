'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface Profile {
    id: string;
    username: string;
    created_at: string;
}

export default function DashboardPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                router.push('/login');
                return;
            }

            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Erro ao buscar perfil:', error.message);
            } else {
                setProfile(profileData);
            }
        }

        fetchData();
    }, []);

    if (!profile) return <p>Carregando…</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-green-400">Bem-vindo, {profile.username}</h1>
            <p className="mt-2 text-yellow-400">Conta criada em: {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
    );
}
