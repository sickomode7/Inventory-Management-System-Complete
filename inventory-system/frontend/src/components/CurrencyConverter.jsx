import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as services from '../api/services';
import { RefreshCw, DollarSign } from 'lucide-react';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState('1');
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [result, setResult] = useState(null);

    // We use useQuery but with enabled: false to trigger manually or simple fetch
    // For a converter, instant feedback is nice.

    const handleConvert = async (e) => {
        e.preventDefault();
        try {
            const data = await services.convertCurrency(amount, targetCurrency);
            setResult(data.amount);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card h-full">
            <h3 className="text-slate-500 font-medium mb-4 flex items-center gap-2">
                <DollarSign size={18} /> Currency Exchange
            </h3>

            <form onSubmit={handleConvert} className="space-y-4">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-xs text-slate-400 block mb-1">INR (Amount)</label>
                        <input
                            type="number"
                            className="input font-mono"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="w-24">
                        <label className="text-xs text-slate-400 block mb-1">To</label>
                        <select
                            className="input font-mono"
                            value={targetCurrency}
                            onChange={(e) => setTargetCurrency(e.target.value)}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="AED">AED</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-ghost w-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                    <RefreshCw size={16} className="mr-2" /> Convert
                </button>

                {result && (
                    <div className="text-center p-3 bg-slate-50 rounded border border-slate-100 mt-2">
                        <div className="text-xs text-slate-400">Estimated Value</div>
                        <div className="text-xl font-bold text-emerald-600">
                            {result.toFixed(2)} {targetCurrency}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CurrencyConverter;
