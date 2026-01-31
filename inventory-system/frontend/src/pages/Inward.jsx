import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as services from '../api/services';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';

const Inward = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const queryClient = useQueryClient();

    // Fetch Inventory to check existing
    const { data: inventory } = useQuery({ queryKey: ['inventory'], queryFn: services.getAllInventory });
    // Fetch All Products to allow new inward
    const { data: products } = useQuery({ queryKey: ['products'], queryFn: () => services.getAllProducts({ size: 100 }) });

    const mutation = useMutation({
        mutationFn: ({ id, qty }) => services.updateStock(id, qty),
        onSuccess: () => {
            setSuccess(`Successfully added ${quantity} units!`);
            setQuantity('');
            setSelectedProduct(null);
            setError('');
            queryClient.invalidateQueries(['inventory']);
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to update stock');
        }
    });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setSelectedProduct(null);
        setSuccess('');
        setError('');
    };

    const filteredProducts = products?.content?.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        mutation.mutate({ id: selectedProduct.id, qty: parseInt(quantity) });
    };

    const existingInventory = selectedProduct
        ? inventory?.find(i => i.product.id === selectedProduct.id)
        : null;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-emerald-600">INWARD</span> Register
            </h2>

            <div className="card p-6">
                <label className="label">1. Select Product</label>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        className="input pl-10"
                        placeholder="Search by Name or SKU..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                {searchTerm && !selectedProduct && (
                    <ul className="border rounded-md max-h-48 overflow-y-auto mb-4 bg-white">
                        {filteredProducts?.map(product => (
                            <li
                                key={product.id}
                                className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0"
                                onClick={() => { setSearchTerm(product.name); setSelectedProduct(product); }}
                            >
                                <div className="font-medium text-slate-800">{product.name}</div>
                                <div className="text-xs text-slate-500">{product.brand} | {product.sku}</div>
                            </li>
                        ))}
                        {filteredProducts?.length === 0 && (
                            <li className="p-3 text-slate-400 text-sm">No products found.</li>
                        )}
                    </ul>
                )}

                {selectedProduct && (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                            <h3 className="font-bold text-slate-800">{selectedProduct.name}</h3>
                            <div className="flex gap-4 mt-2 text-sm text-slate-600">
                                <div>
                                    <span className="block text-xs text-slate-400">SKU</span>
                                    {selectedProduct.sku}
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400">Godown</span>
                                    {existingInventory ? existingInventory.warehouseLocation : 'Default Warehouse (New)'}
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400">Current Stock</span>
                                    <span className="font-mono font-bold text-slate-900">{existingInventory ? existingInventory.quantity : 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="label">2. Quantity to Add</label>
                            <input
                                type="number"
                                className="input text-lg font-mono font-bold"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                min="1"
                                required
                            />
                        </div>

                        {error && <div className="text-danger text-sm flex items-center gap-1"><AlertCircle size={14} /> {error}</div>}
                        {success && <div className="text-success text-sm flex items-center gap-1"><CheckCircle size={14} /> {success}</div>}

                        <button type="submit" className="btn btn-primary w-full py-3" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Processing...' : 'CONFIRM INWARD'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Inward;
