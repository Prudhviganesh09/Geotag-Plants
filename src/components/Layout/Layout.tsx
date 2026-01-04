import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/userSlice';
import { LogOut, Sprout } from 'lucide-react';
import ToastContainer from '../Common/ToastContainer';

const Layout: React.FC = () => {
    const { emailId } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-earth-50 flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-farm-500 p-2 rounded-lg text-white">
                            <Sprout size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-farm-900 hidden sm:block">
                            GeoTag Farm
                        </h1>
                    </div>

                    {emailId && (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 hidden sm:inline-block">
                                {emailId}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>

            <ToastContainer />

            <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} GeoTag Farm. Built for Farmers.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
