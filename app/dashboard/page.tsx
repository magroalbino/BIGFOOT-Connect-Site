import Earnings from '../../components/Earnings';
import StatsChart from '../../components/StatsChart';
import StatusCard from '../../components/StatusCard';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <Earnings />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2">
                    <StatsChart />
                </div>
                <StatusCard />
            </div>
        </div>
    );
}
