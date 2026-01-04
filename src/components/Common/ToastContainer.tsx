import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeToast } from '../../redux/slices/uiSlice';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';

const ToastContainer: React.FC = () => {
    const { toasts } = useSelector((state: RootState) => state.ui);
    const dispatch = useDispatch();

    useEffect(() => {
        toasts.forEach((toast) => {
            const timer = setTimeout(() => {
                dispatch(removeToast(toast.id));
            }, 5000); // Auto close after 5s
            return () => clearTimeout(timer);
        });
    }, [toasts, dispatch]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 flex flex-col items-end pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={clsx(
                        "pointer-events-auto min-w-[300px] max-w-sm rounded-lg shadow-lg border p-4 flex items-start gap-3 transition-all animate-[slideIn_0.3s_ease-out]",
                        {
                            "bg-white border-green-200 text-green-800": toast.type === 'success',
                            "bg-white border-red-200 text-red-800": toast.type === 'error',
                            "bg-white border-blue-200 text-blue-800": toast.type === 'info',
                        }
                    )}
                >
                    {toast.type === 'success' && <CheckCircle size={20} className="text-green-500 mt-0.5" />}
                    {toast.type === 'error' && <AlertCircle size={20} className="text-red-500 mt-0.5" />}
                    {toast.type === 'info' && <Info size={20} className="text-blue-500 mt-0.5" />}

                    <div className="flex-1">
                        <p className="text-sm font-medium">{toast.message}</p>
                    </div>

                    <button
                        onClick={() => dispatch(removeToast(toast.id))}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
