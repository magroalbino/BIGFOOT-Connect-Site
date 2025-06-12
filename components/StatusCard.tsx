export default function StatusCard() {
    return (
        <div className="bg-white border p-4 rounded shadow h-fit">
            <h3 className="text-sm font-semibold mb-2">Network Status</h3>
            <p className="text-green-600 font-bold mb-2">Connected</p>
            <p className="text-sm text-gray-600">Device Type: <span className="font-medium">Grass Desktop</span></p>
            <p className="text-sm text-gray-600">Multiplier: <span className="font-medium text-green-700">2.00x</span></p>
        </div>
    );
}
