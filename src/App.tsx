import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './redux/store';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';

import DashboardPage from './pages/DashboardPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { emailId } = useSelector((state: RootState) => state.user);
    if (!emailId) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

function AppContent() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route
                        path="dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

export default App;
