import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as services from '../api/services';
import { Search, Filter } from 'lucide-react';

const Stock = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All'); // All, Steel, Cement

    const { data: inventory, isLoading } = useQuery({
        queryKey: ['inventory'],
        queryFn: services.getAllInventory,
    });

    const filteredData = inventory?.filter(item => {
        const term = searchTerm.toLowerCase();
        const productName = item.product?.name?.toLowerCase() || '';
        const brand = item.product?.brand?.toLowerCase() || '';
        const sku = item.product?.sku?.toLowerCase() || '';
        const type = item.product?.category || '';

        const matchesSearch = productName.includes(term) || brand.includes(term) || sku.includes(term);
        const matchesType = filterType === 'All' || type === filterType;

        return matchesSearch && matchesType;
    });

    if (isLoading) return <div className="p-6">Loading Stock Register...</div>;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Stock Register</h2>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search Item, Brand, SKU..."
                            className="input pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="input w-auto font-medium"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Steel">Steel</option>
                        <option value="Cement">Cement</option>
                    </select>
                </div>
            </div>

            <div className="table-container bg-white shadow-sm">
                <table>
                    <thead>
                        <tr>
                            <th>Item Code (SKU)</th>
                            <th>Product</th>
                            <th>Brand</th>
                            <th>Type</th>
                            <th>Godown</th>
                            <th>Available Stock</th>
                            <th>Unit Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.length > 0 ? (
                            filteredData.map(item => (
                                <tr key={item.id}>
                                    <td className="font-mono text-xs text-slate-500">{item.product.sku || '-'}</td>
                                    <td className="font-medium">{item.product.name}
                                        <div className="text-xs text-slate-400">{item.product.grade}</div>
                                    </td>
                                    <td>{item.product.brand}</td>
                                    <td>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.product.category === 'Steel' ? 'bg-slate-100 text-slate-700' : 'bg-stone-100 text-stone-700'
                                            }`}>
                                            {item.product.category}
                                        </span>
                                    </td>
                                    <td>{item.warehouseLocation}</td>
                                    <td className="text-lg">
                                        <span className={item.quantity <= (item.reorderLevel || 0) ? 'text-danger font-bold' : 'text-slate-800 font-bold'}>
                                            {item.quantity}
                                        </span>
                                        <span className="text-xs text-slate-400 ml-1">{item.product.unit}</span>
                                    </td>
                                    <td className="font-mono">${item.product.unitPrice}</td>
                                    <td>
                                        {item.quantity <= (item.reorderLevel || 0) ? (
                                            <span className="text-xs text-red-600 font-bold flex items-center gap-1">
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="text-xs text-emerald-600 font-medium">OK</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-8 text-slate-400">No stock records found matching filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Stock;
