// Dashboard do usuário

import { Card } from '../../components/Card';

export default function Dashboard() {
    return (
        <main className="p-6 bg-[#F9FFF2] min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-[#1A1A1A]">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="Epoch Earnings">
                    <p className="text-2xl font-bold text-[#1A1A1A]">20.58K</p>
                    <p className="text-sm text-gray-500">Uptime: 6d 18h</p>
                </Card>

                <Card title="Today's Earnings">
                    <p className="text-2xl font-bold text-[#1A1A1A]">348.26</p>
                    <p className="text-sm text-gray-500">Uptime: 10h</p>
                </Card>
            </div>
        </main>
    );
}
