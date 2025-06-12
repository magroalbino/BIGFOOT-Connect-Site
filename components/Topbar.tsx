export default function Topbar() {
    return (
        <header className="flex items-center justify-between bg-white p-4 border-b shadow-sm">
            <span className="font-semibold text-lg text-green-600">Grow your earnings</span>
            <div className="flex items-center gap-4">
                <button className="bg-green-200 text-green-800 px-4 py-2 rounded">Share with Friends</button>
                <span className="text-sm text-gray-700">Hello, yanrenat!</span>
                <img src="/avatar.png" alt="Profile" className="w-8 h-8 rounded-full" />
            </div>
        </header>
    );
}
