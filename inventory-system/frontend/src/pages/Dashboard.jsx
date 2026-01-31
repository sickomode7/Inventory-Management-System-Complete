import { useQuery } from '@tanstack/react-query';
import * as services from '../api/services';
import { useAuth } from '../context/AuthContext';
import CurrencyConverter from '../components/CurrencyConverter';
import { TrendingUp, AlertTriangle, Layers, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon, colorClass }) => (
    <div className="card flex items-start justify-between">
        <div>
            <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-md ${colorClass} text-white`}>
            {icon}
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();

    const { data: inventory, isLoading } = useQuery({
        queryKey: ['inventory'],
        queryFn: services.getAllInventory,
    });

    if (isLoading) return <div className="p-6">Loading Dashboard...</div>;

    // Calculate Metrics
    let totalSteel = 0;
    let totalCement = 0;
    let totalValue = 0;
    const lowStockItems = [];

    inventory?.forEach(item => {
        const qty = item.quantity || 0;
        const price = item.product?.unitPrice || 0;

        if (item.product?.category?.toLowerCase() === 'steel') {
            totalSteel += qty;
        } else if (item.product?.category?.toLowerCase() === 'cement') {
            totalCement += qty;
        }

        totalValue += (qty * price);

        if (item.reorderLevel && qty <= item.reorderLevel) {
            lowStockItems.push(item);
        }
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
                    <p className="text-slate-500">Welcome back, {user?.username}</p>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Steel Stock"
                    value={totalSteel.toLocaleString()}
                    subtext="Units"
                    icon={<Layers size={24} />}
                    colorClass="bg-slate-700"
                />
                <StatCard
                    title="Total Cement Stock"
                    value={totalCement.toLocaleString()}
                    subtext="Bags/Units"
                    icon={<Layers size={24} />}
                    colorClass="bg-stone-500"
                />
                <StatCard
                    title="Inventory Value"
                    value={`$${totalValue.toLocaleString()}`}
                    subtext="Estimated"
                    icon={<DollarSign size={24} />}
                    colorClass="bg-emerald-600"
                />
            </div>

            {/* Currency Converter Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CurrencyConverter />
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <div className="card border-l-4 border-l-red-500">
                    <div className="flex items-center gap-2 mb-4 text-red-600 font-bold">
                        <AlertTriangle size={20} />
                        <h3>Low Stock Alerts ({lowStockItems.length})</h3>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Godown</th>
                                    <th>Available</th>
                                    <th>Min Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockItems.map(item => (
                                    <tr key={item.id}>
                                        <td className="font-medium text-slate-700">{item.product.name}</td>
                                        <td>{item.warehouseLocation}</td>
                                        <td className="text-red-600 font-bold">{item.quantity}</td>
                                        <td className="text-slate-500">{item.reorderLevel}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
