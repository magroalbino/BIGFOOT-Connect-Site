export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r px-6 py-4 shadow-sm">
            <h1 className="text-2xl font-bold mb-8">BIGFOOT Connect</h1>
            <nav className="space-y-4">
                <a href="/dashboard" className="block font-medium text-green-600">Dashboard</a>
                <span className="text-gray-400">Data Labeling (Coming Soon)</span>
                <a href="#" className="block">Referral Program</a>
                <a href="#" className="block">Rewards</a>
                <a href="#" className="block">Store</a>
                <a href="#" className="block text-red-500 mt-12">Logout</a>
            </nav>
        </aside>
    );
}
