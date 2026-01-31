import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, LogOut, FileText, PackagePlus } from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useAuth();

    const navItems = [
        { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { to: '/stock', label: 'Stock', icon: <Package size={20} /> },
        { to: '/products/new', label: 'New Item', icon: <PackagePlus size={20} /> },
        { to: '/inward', label: 'Inward', icon: <ArrowDownToLine size={20} /> },
        { to: '/outward', label: 'Outward', icon: <ArrowUpFromLine size={20} /> },
        { to: '/transfers', label: 'Transfers', icon: <ArrowLeftRight size={20} /> },
        { to: '/reports', label: 'Reports', icon: <FileText size={20} /> },
    ];

    return (
        <aside className="h-screen w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold text-white tracking-wider">IRON & CEMENT</h1>
                <p className="text-xs text-slate-400 mt-1">Trading System</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive
                                        ? 'bg-sky-600 text-white font-medium'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="mb-4 px-2">
                    <p className="text-sm font-medium text-white">{user?.username}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.roles?.[0] || 'User'}</p>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-200 py-2 rounded-md transition-colors text-sm"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
