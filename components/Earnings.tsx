export default function Earnings() {
    return (
        <section className="bg-green-50 border rounded-lg p-6 shadow">
            <h2 className="text-lg font-bold mb-4">Earnings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow text-center">
                    <p className="text-gray-500 text-sm">Epoch 8 Earnings</p>
                    <p className="text-2xl font-bold text-green-700">22.06K</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                    <p className="text-gray-500 text-sm">Today’s Earnings</p>
                    <p className="text-2xl font-bold text-green-700">29.53</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                    <p className="text-gray-500 text-sm">Uptime</p>
                    <p className="text-md">0 day, 1 hr, 33 mins</p>
                </div>
            </div>
        </section>
    );
}
