'use client';
import Image from 'next/image';

export default function Sidebar() {
    return (
        <aside className="w-60 bg-card shadow-md min-h-screen p-6">
            <div className="mb-10">
                <Image
                    src="/logo.svg"
                    alt="Logo BIGFOOT Connect"
                    width={100}
                    height={40}
                    className="mx-auto"
                />
            </div>
            <nav className="flex flex-col gap-4">
                <a href="/dashboard" className="text-primary font-medium hover:underline">
                    Dashboard
                </a>
                <a href="/pairing" className="text-primary font-medium hover:underline">
                    Pareamento
                </a>
            </nav>
        </aside>
    );
}
