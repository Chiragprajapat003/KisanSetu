import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBuyerDashboard } from '../../services/user.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import './Buyer.css';

const BuyerDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getBuyerDashboard();
                setDashboard(response.data.dashboard);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;

    const { stats, recentOrders, recommendedProducts } = dashboard || {};

    return (
        <div className="buyer-dashboard">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Welcome back</h1>
                        <p className="page-subtitle">Fresh produce from nearby farms — straight to you</p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" aria-hidden="true">○</div>
                        <div className="stat-value">{stats?.activeOrders || 0}</div>
                        <div className="stat-label">Active orders</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" aria-hidden="true">✓</div>
                        <div className="stat-value">{stats?.completedOrders || 0}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" aria-hidden="true">—</div>
                        <div className="stat-value">₹{stats?.totalSpent?.toLocaleString() || 0}</div>
                        <div className="stat-label">Total spent</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" aria-hidden="true">◆</div>
                        <div className="stat-value">{stats?.cartItems || 0}</div>
                        <div className="stat-label">In cart</div>
                    </div>
                </div>

                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Orders</h2>
                        <Link to="/buyer/orders" className="btn btn-secondary">View All</Link>
                    </div>
                    <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {recentOrders?.length > 0 ? recentOrders.map(order => (
                            <div key={order._id} className="order-item-card">
                                <img src={order.productDetails?.image || order.items?.[0]?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=60'}
                                    alt="" className="order-item-img" />
                                <div className="order-item-info" style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.productDetails?.name || order.items?.[0]?.name || 'Order'}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>From {order.farmerDetails?.name || 'farmer'} • ₹{order.totalPrice}</p>
                                </div>
                                <span className={`badge badge-${order.status === 'delivered' ? 'success' :
                                    order.status === 'pending' ? 'warning' : order.status === 'cancelled' ? 'danger' : 'primary'}`}>
                                    {order.status}
                                </span>
                            </div>
                        )) : <p className="text-muted">No orders yet — browse produce to get started.</p>}
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Recommended for You</h2>
                        <Link to="/buyer/browse" className="btn btn-primary">Browse All</Link>
                    </div>
                    <div className="products-carousel grid grid-3">
                        {recommendedProducts?.slice(0, 6).map(product => (
                            <Link key={product._id} to={`/buyer/product/${product._id}`} className="product-card-small card" style={{ textDecoration: 'none' }}>
                                <img src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                                    alt={product.productName} className="product-image" style={{ height: '160px' }} />
                                <div className="product-card-content" style={{ padding: '12px' }}>
                                    <span className="badge badge-primary">{product.category}</span>
                                    <h4 style={{ fontSize: '0.95rem', margin: '6px 0 4px', color: 'var(--color-text-strong)' }}>{product.productName}</h4>
                                    <div className="product-card-meta">
                                        <span className="price" style={{ fontWeight: 600 }}>₹{product.price}/kg</span>
                                        <span className="rating" style={{ color: 'var(--color-text-light)', fontSize: '0.8rem' }}>{product.rating ? `${Number(product.rating).toFixed(1)} / 5` : 'New'}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BuyerDashboard;
