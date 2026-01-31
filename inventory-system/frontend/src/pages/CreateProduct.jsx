import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as services from '../api/services';
import { PackagePlus, CheckCircle, AlertCircle } from 'lucide-react';

const CreateProduct = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: 'Steel',
        grade: '',
        unitPrice: '',
        unit: 'kg',
        weightPerUnit: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const mutation = useMutation({
        mutationFn: (data) => services.createProduct(data),
        onSuccess: () => {
            setSuccess('Product Master created! Redirecting to Inward...');
            queryClient.invalidateQueries(['products']);
            setTimeout(() => navigate('/inward'), 1500);
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to create product');
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.brand || !formData.unitPrice) {
            setError('Please fill in required fields');
            return;
        }

        const payload = {
            ...formData,
            unitPrice: parseFloat(formData.unitPrice),
            weightPerUnit: parseFloat(formData.weightPerUnit) || 0
        };

        mutation.mutate(payload);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <PackagePlus className="text-sky-600" />
                New Item Master
            </h2>

            <div className="card p-6">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm flex items-center gap-2"><AlertCircle size={16} />{error}</div>}
                {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded mb-4 text-sm flex items-center gap-2"><CheckCircle size={16} />{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="label">Product Name *</label>
                            <input name="name" className="input" placeholder="e.g. TMT Bar 12mm" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div>
                            <label className="label">Brand *</label>
                            <input name="brand" className="input" placeholder="e.g. Tata" value={formData.brand} onChange={handleChange} required />
                        </div>

                        <div>
                            <label className="label">Category *</label>
                            <select name="category" className="input" value={formData.category} onChange={handleChange}>
                                <option value="Steel">Steel</option>
                                <option value="Cement">Cement</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Grade</label>
                            <input name="grade" className="input" placeholder="e.g. Fe500D" value={formData.grade} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="label">Unit</label>
                            <input name="unit" className="input" placeholder="e.g. piece, bag" value={formData.unit} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="label">Unit Price (₹) *</label>
                            <input type="number" step="0.01" name="unitPrice" className="input font-mono" placeholder="0.00" value={formData.unitPrice} onChange={handleChange} required />
                        </div>

                        <div>
                            <label className="label">Weight per Unit (kg)</label>
                            <input type="number" step="0.01" name="weightPerUnit" className="input font-mono" placeholder="0.00" value={formData.weightPerUnit} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full py-3" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Saving...' : 'CREATE ITEM MASTER'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
