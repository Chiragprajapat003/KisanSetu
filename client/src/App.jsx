import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ProductProvider } from './contexts/ProductContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import Header from './components/shared/Header.jsx';
import Footer from './components/shared/Footer.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';
import LoadingFallback from './components/shared/LoadingFallback.jsx';

import AIChatAssistant from './components/ai/AIChatAssistant.jsx';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage.jsx'));

const FarmerDashboard = lazy(() => import('./pages/farmer/FarmerDashboard.jsx'));
const ProductManagement = lazy(() => import('./pages/farmer/ProductManagement.jsx'));
const OrdersManagement = lazy(() => import('./pages/farmer/OrdersManagement.jsx'));
const FarmerProfilePage = lazy(() => import('./pages/farmer/FarmerProfilePage.jsx'));
const FarmerMessages = lazy(() => import('./pages/farmer/FarmerMessages.jsx'));

const BuyerDashboard = lazy(() => import('./pages/buyer/BuyerDashboard.jsx'));
const BrowseProducts = lazy(() => import('./pages/buyer/BrowseProducts.jsx'));
const ProductDetail = lazy(() => import('./pages/buyer/ProductDetail.jsx'));
const CartPage = lazy(() => import('./pages/buyer/CartPage.jsx'));
const OrderHistory = lazy(() => import('./pages/buyer/OrderHistory.jsx'));
const FeedbackForm = lazy(() => import('./pages/buyer/FeedbackForm.jsx'));
const ProfilePage = lazy(() => import('./pages/buyer/ProfilePage.jsx'));
const BuyerMessages = lazy(() => import('./pages/buyer/BuyerMessages.jsx'));

const FarmerPublicProfile = lazy(() => import('./pages/public/FarmerPublicProfile.jsx'));
const HomePage = lazy(() => import('./pages/public/HomePage.jsx'));

const UnauthorizedPage = () => (
    <div className="unauthorized-page">
        <div className="unauthorized-card">
            <div className="unauthorized-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
            </div>
            <h1>Access restricted</h1>
            <p>You don't have permission to view this page.</p>
            <a href="/" className="btn btn-primary">Go to home</a>
        </div>
        <style>{`
            .unauthorized-page { text-align: center; padding: 4rem 1rem; }
            .unauthorized-card { max-width: 420px; margin: 0 auto; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 16px; padding: 32px 24px; }
            .unauthorized-icon { width: 56px; height: 56px; border-radius: 999px; background: var(--color-danger-light); border: 1px solid #E8C4C4; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--color-danger); }
            .unauthorized-card h1 { font-size: 1.25rem; margin-bottom: 8px; }
            .unauthorized-card p { color: var(--color-text-light); font-size: 0.9rem; margin-bottom: 20px; }
        `}</style>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <ProductProvider>
                    <CartProvider>
                        <div className="app-container">
                            <Header />
                            <main className="main-content">
                                <Suspense fallback={<LoadingFallback />}>
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/auth/login" element={<LoginPage />} />
                                        <Route path="/auth/signup" element={<SignupPage />} />
                                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                                        <Route path="/farmer/dashboard" element={
                                            <ProtectedRoute requiredRole="farmer"><FarmerDashboard /></ProtectedRoute>
                                        } />
                                        <Route path="/farmer/products" element={
                                            <ProtectedRoute requiredRole="farmer"><ProductManagement /></ProtectedRoute>
                                        } />
                                        <Route path="/farmer/orders" element={
                                            <ProtectedRoute requiredRole="farmer"><OrdersManagement /></ProtectedRoute>
                                        } />
                                        <Route path="/farmer/profile" element={
                                            <ProtectedRoute requiredRole="farmer"><FarmerProfilePage /></ProtectedRoute>
                                        } />
                                        <Route path="/farmer/messages" element={
                                            <ProtectedRoute requiredRole="farmer"><FarmerMessages /></ProtectedRoute>
                                        } />

                                        <Route path="/buyer/dashboard" element={
                                            <ProtectedRoute requiredRole="buyer"><BuyerDashboard /></ProtectedRoute>
                                        } />
                                        <Route path="/buyer/browse" element={
                                            <ProtectedRoute requiredRole="buyer"><BrowseProducts /></ProtectedRoute>
                                        } />
                                        <Route path="/buyer/product/:id" element={
                                            <ProtectedRoute requiredRole="buyer"><ProductDetail /></ProtectedRoute>
                                        } />
                                        <Route path="/buyer/cart" element={
                                            <ProtectedRoute requiredRole="buyer"><CartPage /></ProtectedRoute>
                                        } />
                                        <Route path="/buyer/orders" element={
                                            <ProtectedRoute requiredRole="buyer"><OrderHistory /></ProtectedRoute>
                                        } />
                                        <Route path="/buyer/feedback/:orderId" element={
                                            <ProtectedRoute requiredRole="buyer"><FeedbackForm /></ProtectedRoute>
                                        } />
                                        <Route path="/buyer/profile" element={
                                            <ProtectedRoute requiredRole="buyer"><ProfilePage /></ProtectedRoute>
                                        } />
                                        <Route path="/buyer/messages" element={
                                            <ProtectedRoute requiredRole="buyer"><BuyerMessages /></ProtectedRoute>
                                        } />

                                        {/* Public Routes (no auth required) */}
                                        <Route path="/farmer/:farmerId" element={<FarmerPublicProfile />} />

                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </Suspense>
                            </main>
                            <Footer />
                            <AIChatAssistant />
                        </div>
                    </CartProvider>
                </ProductProvider>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
