import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserEmail } from '../redux/slices/userSlice';
import { Sprout, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        dispatch(setUserEmail(email));
        navigate('/dashboard');
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-farm-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-farm-100 rounded-full flex items-center justify-center text-farm-600 mb-4">
                        <Sprout size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Farmer</h2>
                    <p className="text-gray-500 text-center mt-2">
                        Enter your email to start managing your plant locations
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none transition-all"
                            placeholder="farmer@example.com"
                            autoFocus
                        />
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-farm-600 hover:bg-farm-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                    >
                        <span>Continue to Dashboard</span>
                        <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
