import { AlertTriangle } from 'lucide-react';

const Transfers = () => {
    return (
        <div className="p-6 flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="bg-amber-50 p-6 rounded-full text-amber-500 mb-4">
                <AlertTriangle size={48} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Transfers Not Available</h2>
            <p className="text-slate-500 max-w-md">
                The system currently supports a single "Default Warehouse" per product.
                Multi-warehouse inventory transfer is not supported by the backend v1.0.
            </p>
        </div>
    );
};

export default Transfers;
