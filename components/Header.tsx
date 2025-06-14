// components/Header.tsx
export default function Header() {
    return (
        <header className="bg-card shadow-md px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="BIGFOOT Connect" className="h-8" />
                <span className="text-primary font-bold text-xl">BIGFOOT Connect</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm">Hey! 👋 Yan Leite</span>
                <button className="bg-primary text-white px-3 py-1 rounded hover:bg-opacity-80 transition">
                    Sair
                </button>
            </div>
        </header>
    );
}
