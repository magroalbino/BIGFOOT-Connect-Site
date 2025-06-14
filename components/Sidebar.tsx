// components/Sidebar.tsx
export default function Sidebar() {
    return (
        <aside className="w-60 bg-card shadow-md min-h-screen p-6">
            <div className="mb-10">
                <img src="/logo.svg" className="h-10 mx-auto" />
            </div>
            <nav className="flex flex-col gap-4">
                <a href="/dashboard" className="text-primary font-medium hover:underline">Dashboard</a>
                <a href="/pairing" className="text-primary font-medium hover:underline">Pareamento</a>
            </nav>
        </aside>
    );
}
