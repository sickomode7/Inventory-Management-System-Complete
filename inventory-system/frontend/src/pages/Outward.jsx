import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as services from '../api/services';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';

const Outward = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const queryClient = useQueryClient();

    // For Outward, we only care about Existing Inventory with Qty > 0
    const { data: inventory } = useQuery({ queryKey: ['inventory'], queryFn: services.getAllInventory });

    const mutation = useMutation({
        mutationFn: ({ id, qty }) => services.updateStock(id, -qty), // Negative for outward
        onSuccess: () => {
            setSuccess(`Successfully dispatched ${quantity} units!`);
            setQuantity('');
            setSelectedInventory(null);
            setError('');
            queryClient.invalidateQueries(['inventory']);
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to update stock');
        }
    });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setSelectedInventory(null);
        setSuccess('');
        setError('');
    };

    const filteredInventory = inventory?.filter(item =>
        item.quantity > 0 && (
            item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedInventory) return;

        // Client side validation
        const qty = parseInt(quantity);
        if (qty > selectedInventory.quantity) {
            setError(`Insufficient Stock! Only ${selectedInventory.quantity} available.`);
            return;
        }

        mutation.mutate({ id: selectedInventory.product.id, qty: qty });
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-red-600">OUTWARD</span> Register
            </h2>

            <div className="card p-6 border-t-4 border-t-red-600">
                <label className="label">1. Select Product (From Available Stock)</label>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        className="input pl-10"
                        placeholder="Search Available Stock..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                {searchTerm && !selectedInventory && (
                    <ul className="border rounded-md max-h-48 overflow-y-auto mb-4 bg-white">
                        {filteredInventory?.map(item => (
                            <li
                                key={item.id}
                                className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 flex justify-between items-center"
                                onClick={() => { setSearchTerm(item.product.name); setSelectedInventory(item); }}
                            >
                                <div>
                                    <div className="font-medium text-slate-800">{item.product.name}</div>
                                    <div className="text-xs text-slate-500">{item.warehouseLocation} | {item.product.sku}</div>
                                </div>
                                <div className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                    {item.quantity} Avl
                                </div>
                            </li>
                        ))}
                        {filteredInventory?.length === 0 && (
                            <li className="p-3 text-slate-400 text-sm">No matching stock found.</li>
                        )}
                    </ul>
                )}

                {selectedInventory && (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
                        <div className="bg-red-50 p-4 rounded-md border border-red-100">
                            <h3 className="font-bold text-slate-800">{selectedInventory.product.name}</h3>
                            <div className="flex gap-4 mt-2 text-sm text-slate-600">
                                <div>
                                    <span className="block text-xs text-slate-400">SKU</span>
                                    {selectedInventory.product.sku}
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400">From Godown</span>
                                    {selectedInventory.warehouseLocation}
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400">Available</span>
                                    <span className="font-mono font-bold text-red-700 text-lg">{selectedInventory.quantity}</span>
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="label">2. Quantity to Dispatch</label>
                            <input
                                type="number"
                                className="input text-lg font-mono font-bold border-red-200 focus:outline-red-500"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                min="1"
                                max={selectedInventory.quantity}
                                required
                            />
                            <p className="text-xs text-slate-400 mt-1">Cannot exceed {selectedInventory.quantity}</p>
                        </div>

                        {error && <div className="text-danger text-sm flex items-center gap-1"><AlertCircle size={14} /> {error}</div>}
                        {success && <div className="text-success text-sm flex items-center gap-1"><CheckCircle size={14} /> {success}</div>}

                        <button type="submit" className="btn btn-danger w-full py-3" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Processing...' : 'CONFIRM DISPATCH'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Outward;
