import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFarmerDashboard } from '../../services/user.service';
import { useSocket } from '../../hooks/useSocket';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import './Farmer.css';

const FarmerDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const { notifications } = useSocket();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getFarmerDashboard();
                setDashboard(response.data.dashboard);
            } catch (error) {
                console.error('Error fetching dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;

    const { stats, recentOrders, recentFeedback, rating } = dashboard || {};

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    };
    const pending = stats?.pendingOrders || 0;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-greeting">
                    <h1>{greeting()}</h1>
                    <p>Here's what needs your attention today.</p>
                </div>

                {pending > 0 ? (
                    <Link to="/farmer/orders" className="attention-card" style={{ textDecoration: 'none' }}>
                        <div>
                            <p>{pending} order{pending > 1 ? 's' : ''} need your attention</p>
                            <span>Review and update their status</span>
                        </div>
                        <span style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 12px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>View orders</span>
                    </Link>
                ) : (
                    <div className="attention-card" style={{ background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                        <div>
                            <p style={{ color: 'var(--color-text-strong)' }}>All caught up</p>
                            <span style={{ color: 'var(--color-text-light)' }}>No orders waiting — your products are live.</span>
                        </div>
                    </div>
                )}

                {notifications.length > 0 && (
                    <div className="notifications-banner">
                        {notifications.length} new update{notifications.length > 1 ? 's' : ''} — check orders or messages
                    </div>
                )}

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" aria-hidden="true">—</div>
                        <div className="stat-value">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
                        <div className="stat-label">Total earnings</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" aria-hidden="true">◆</div>
                        <div className="stat-value">{stats?.totalProducts || 0}</div>
                        <div className="stat-label">Active products</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" aria-hidden="true">○</div>
                        <div className="stat-value">{stats?.pendingOrders || 0}</div>
                        <div className="stat-label">To process</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" aria-hidden="true">✓</div>
                        <div className="stat-value">{stats?.completedOrders || 0}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>Recent Orders</h2>
                            <Link to="/farmer/orders" className="btn btn-secondary">View All</Link>
                        </div>
                        <div className="orders-list">
                            {recentOrders?.length > 0 ? recentOrders.map(order => (
                                <div key={order._id} className="order-item">
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div className="order-product">{order.items?.map(i => i.name).join(', ')}</div>
                                        <div className="order-buyer">{order.buyerDetails?.name} • ₹{order.totalPrice}</div>
                                    </div>
                                    <span className={`badge badge-${order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'warning' : order.status === 'cancelled' ? 'danger' : 'primary'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            )) : <p className="text-muted">No recent orders</p>}
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>Feedback</h2>
                            <div className="rating-display">{rating ? `${Number(rating).toFixed(1)} / 5` : 'No rating yet'}</div>
                        </div>
                        <div className="feedback-list">
                            {recentFeedback?.length > 0 ? recentFeedback.map(fb => (
                                <div key={fb._id} className="feedback-item">
                                    <div className="feedback-rating" aria-label={`${fb.rating} out of 5`}>{'★'.repeat(fb.rating)}<span style={{ color: '#E8E0D5' }}>{'★'.repeat(5 - fb.rating)}</span></div>
                                    <p className="feedback-review">{fb.review}</p>
                                    <div className="feedback-meta">{fb.buyerName} • {fb.productName}</div>
                                </div>
                            )) : <p className="text-muted">No feedback yet — it will appear here after buyers review your produce.</p>}
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <Link to="/farmer/products" className="btn btn-primary">Manage products</Link>
                    <Link to="/farmer/orders" className="btn btn-secondary">View all orders</Link>
                    <Link to="/farmer/messages" className="btn btn-secondary">Messages</Link>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
