// app/dashboard/page.tsx
export default function Dashboard() {
    return (
        <main className="p-6">
            <h1 className="text-2xl font-semibold mb-4 text-primary">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card title="Total Earnings" value="31070.00" />
                <Card title="Current Epoch" value="0.00" />
                <Card title="Referral Earnings" value="0.00" />
                <Card title="Status" value="Connected" status />
            </div>

            {/* Aqui entra o gráfico (pode usar Chart.js ou Recharts) */}
            <div className="bg-card p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2 text-primary">Earnings flow through time</h2>
                {/* componente de gráfico aqui */}
            </div>
        </main>
    );
}

function Card({ title, value, status = false }: { title: string; value: string; status?: boolean }) {
    return (
        <div className="bg-card p-4 rounded shadow text-center">
            <h3 className="text-sm text-muted-foreground">{title}</h3>
            <p className={`text-2xl font-bold ${status ? 'text-green-600' : 'text-secondary'}`}>{value}</p>
        </div>
    );
}
