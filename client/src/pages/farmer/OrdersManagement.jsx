import { useState, useEffect } from 'react';
import { getMyOrders, updateOrderStatus, cancelOrder } from '../../services/order.service';
import { confirmCashPayment } from '../../services/payment.service';
import { useSocket } from '../../hooks/useSocket';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import Toast, { useToast } from '../../components/shared/Toast.jsx';
import RouteOptimizationModal from '../../components/shared/RouteOptimizationModal.jsx';
import './Farmer.css';

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [cancelModal, setCancelModal] = useState({ show: false, orderId: null, reason: '' });
    const [showOptimizeModal, setShowOptimizeModal] = useState(false);
    const { notifications } = useSocket();
    const { toasts, success, error } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (notifications.some(n => n.type === 'newOrder')) {
            fetchOrders();
        }
    }, [notifications]);

    const fetchOrders = async () => {
        try {
            const response = await getMyOrders();
            setOrders(response.data.orders || []);
        } catch (err) {
            error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            success(`Order marked as ${newStatus}`);
            fetchOrders();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleCancelOrder = async (e) => {
        e.preventDefault();
        try {
            await cancelOrder(cancelModal.orderId, cancelModal.reason);
            success('Order cancelled and buyer notified');
            setCancelModal({ show: false, orderId: null, reason: '' });
            fetchOrders();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    const handleCashConfirmation = async (orderId) => {
        if (!window.confirm('Confirm that you have received cash payment from the buyer?')) return;
        try {
            await confirmCashPayment(orderId);
            success('Cash payment confirmed & Wallet updated!');
            fetchOrders();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to confirm payment');
        }
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    if (loading) return <LoadingSpinner text="Loading orders..." />;

    return (
        <div className="orders-page">
            <Toast toasts={toasts} />
            <div className="container">
                <div className="page-header">
                    <div className="page-header-top">
                        <div>
                            <h1 className="page-title">Orders</h1>
                            <p className="page-subtitle">Track and fulfil your buyer orders</p>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowOptimizeModal(true)}
                            title="Optimize delivery route for multiple orders"
                        >
                            Plan delivery route
                        </button>
                    </div>
                    <div className="filter-tabs">
                        {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`filter-tab ${filter === f ? 'active' : ''}`}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="empty-state">
                        <h3>No orders found</h3>
                        <p>{filter === 'all' ? 'You have no orders yet' : `No ${filter} orders`}</p>
                    </div>
                ) : (
                    <>
                    <div className="orders-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Seq</th>
                                    <th>Product</th>
                                    <th>Buyer</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders
                                    .sort((a, b) => {
                                        const seqA = a.deliverySequence?.sequence || 9999;
                                        const seqB = b.deliverySequence?.sequence || 9999;
                                        return seqA - seqB || new Date(b.createdAt) - new Date(a.createdAt);
                                    })
                                    .map(order => (
                                        <tr key={order._id}>
                                            <td>
                                                {order.deliverySequence?.sequence && ['processing', 'shipped'].includes(order.status) ? (
                                                    <div className="sequence-badge" title={`Stop #${order.deliverySequence.sequence}`}>
                                                        #{order.deliverySequence.sequence}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="order-product-cell">
                                                    <img src={order.items?.[0]?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=50'}
                                                        alt="" className="order-product-img" />
                                                    <span>{order.items?.map(i => i.name).join(', ')}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>{order.buyerDetails?.name}</div>
                                                <small>{order.buyerDetails?.phno}</small>
                                            </td>
                                            <td>{order.items?.reduce((acc, i) => acc + i.quantity, 0)} kg</td>
                                            <td className="price-cell">
                                                ₹{order.totalPrice}
                                                {order.paymentMethod === 'cash' && order.status !== 'cancelled' && (
                                                    <div style={{ fontSize: '0.75rem', color: order.paymentStatus === 'paid' ? 'var(--color-primary)' : '#8A6D3B', marginTop: '2px' }}>
                                                        {order.paymentStatus === 'paid' ? 'Paid' : 'Cash pending'}
                                                    </div>
                                                )}
                                                {order.paymentMethod === 'online' && order.status !== 'cancelled' && (
                                                    <div style={{ fontSize: '0.75rem', color: order.paymentStatus === 'paid' ? 'var(--color-primary)' : '#2B5A7A', marginTop: '2px' }}>
                                                        {order.paymentStatus === 'paid' ? 'Paid online' : 'Online pending'}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge badge-${order.status === 'delivered' ? 'success' :
                                                    order.status === 'cancelled' ? 'danger' :
                                                        order.status === 'pending' ? 'warning' : 'primary'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                {order.status === 'confirmed' && (
                                                    <div className="action-buttons">
                                                        <button onClick={() => handleStatusUpdate(order._id, 'processing')}
                                                            className="btn btn-primary btn-sm">Start processing</button>
                                                        <button onClick={() => setCancelModal({ show: true, orderId: order._id, reason: '' })}
                                                            className="btn btn-outline-danger btn-sm">Cancel</button>
                                                    </div>
                                                )}
                                                {order.status === 'processing' && (
                                                    <div className="action-buttons">
                                                        <button onClick={() => handleStatusUpdate(order._id, 'shipped')}
                                                            className="btn btn-primary btn-sm">Mark shipped</button>
                                                        {order.buyerDetails?.coordinates?.length === 2 && (
                                                            <a
                                                                href={`https://www.google.com/maps/dir/?api=1&destination=${order.buyerDetails.coordinates[1]},${order.buyerDetails.coordinates[0]}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-secondary btn-sm"
                                                                style={{ textDecoration: 'none' }}
                                                            >
                                                                View route
                                                            </a>
                                                        )}
                                                        <button onClick={() => setCancelModal({ show: true, orderId: order._id, reason: '' })}
                                                            className="btn btn-outline-danger btn-sm">Cancel</button>
                                                    </div>
                                                )}
                                                {order.status === 'shipped' && (
                                                    <div className="action-column">
                                                        <div className="action-buttons">
                                                            <button onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                                                className="btn btn-primary btn-sm">Mark delivered</button>
                                                            {order.buyerDetails?.coordinates?.length === 2 && (
                                                                <a
                                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${order.buyerDetails.coordinates[1]},${order.buyerDetails.coordinates[0]}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-secondary btn-sm"
                                                                    style={{ textDecoration: 'none' }}
                                                                >
                                                                    View route
                                                                </a>
                                                            )}
                                                            <button onClick={() => setCancelModal({ show: true, orderId: order._id, reason: '' })}
                                                                className="btn btn-outline-danger btn-sm">Cancel</button>
                                                        </div>
                                                    </div>
                                                )}
                                                {order.status === 'delivered' && (
                                                    <div className="action-buttons">
                                                        {order.paymentMethod === 'cash' && order.paymentStatus !== 'paid' && (
                                                            <button
                                                                onClick={() => handleCashConfirmation(order._id)}
                                                                className="btn btn-primary btn-sm"
                                                                title="Confirm you received cash from buyer"
                                                            >
                                                                Confirm cash received
                                                            </button>
                                                        )}
                                                        <span className="text-muted" style={{ fontSize: '0.82rem' }}>Completed</span>
                                                    </div>
                                                )}

                                                {order.status === 'pending' && (
                                                    <div className="action-buttons">
                                                        <span className="text-muted" style={{ fontSize: '0.82rem' }}>Awaiting buyer confirmation</span>
                                                        <button onClick={() => setCancelModal({ show: true, orderId: order._id, reason: '' })}
                                                            className="btn btn-outline-danger btn-sm">Cancel</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="orders-cards">
                        {filteredOrders
                            .sort((a, b) => {
                                const seqA = a.deliverySequence?.sequence || 9999;
                                const seqB = b.deliverySequence?.sequence || 9999;
                                return seqA - seqB || new Date(b.createdAt) - new Date(a.createdAt);
                            })
                            .map(order => (
                                <div key={order._id} className="order-card-mobile">
                                    <div className="order-card-mobile-top">
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <div className="order-card-mobile-title">{order.items?.map(i => i.name).join(', ')}</div>
                                            <div className="order-card-mobile-meta">{order.buyerDetails?.name} • {order.buyerDetails?.phno || ''}</div>
                                        </div>
                                        <span className={`badge badge-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : order.status === 'pending' ? 'warning' : 'primary'}`}>{order.status}</span>
                                    </div>
                                    {order.deliverySequence?.sequence && ['processing','shipped'].includes(order.status) && (
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-primary-subtle)', border: '1px solid #D6E4D8', borderRadius: '999px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '10px' }}>Stop #{order.deliverySequence.sequence}</div>
                                    )}
                                    <dl className="order-card-mobile-grid">
                                        <div><dt>Quantity</dt><dd>{order.items?.reduce((acc, i) => acc + i.quantity, 0)} kg</dd></div>
                                        <div><dt>Total</dt><dd>₹{order.totalPrice}</dd></div>
                                        <div><dt>Payment</dt><dd>{order.paymentMethod === 'cash' ? (order.paymentStatus === 'paid' ? 'Paid (cash)' : 'Cash pending') : (order.paymentStatus === 'paid' ? 'Paid online' : 'Online pending')}</dd></div>
                                        <div><dt>Date</dt><dd>{new Date(order.createdAt).toLocaleDateString()}</dd></div>
                                    </dl>
                                    <div className="action-buttons">
                                        {order.status === 'confirmed' && (
                                            <>
                                                <button onClick={() => handleStatusUpdate(order._id, 'processing')} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Start processing</button>
                                                <button onClick={() => setCancelModal({ show: true, orderId: order._id, reason: '' })} className="btn btn-outline-danger btn-sm">Cancel</button>
                                            </>
                                        )}
                                        {order.status === 'processing' && (
                                            <>
                                                <button onClick={() => handleStatusUpdate(order._id, 'shipped')} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Mark shipped</button>
                                                {order.buyerDetails?.coordinates?.length === 2 && (
                                                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${order.buyerDetails.coordinates[1]},${order.buyerDetails.coordinates[0]}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">Route</a>
                                                )}
                                            </>
                                        )}
                                        {order.status === 'shipped' && (
                                            <>
                                                <button onClick={() => handleStatusUpdate(order._id, 'delivered')} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Mark delivered</button>
                                                {order.buyerDetails?.coordinates?.length === 2 && (
                                                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${order.buyerDetails.coordinates[1]},${order.buyerDetails.coordinates[0]}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">Route</a>
                                                )}
                                            </>
                                        )}
                                        {order.status === 'delivered' && order.paymentMethod === 'cash' && order.paymentStatus !== 'paid' && (
                                            <button onClick={() => handleCashConfirmation(order._id)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Confirm cash received</button>
                                        )}
                                        {order.status === 'pending' && (
                                            <span className="text-muted" style={{ fontSize: '0.82rem' }}>Waiting for buyer to verify OTP</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                    </>
                )}

                {/* Cancel Modal */}
                {cancelModal.show && (
                    <div className="modal-overlay" onClick={() => setCancelModal({ show: false, orderId: null, reason: '' })}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Cancel order</h2>
                                <button className="close-btn" onClick={() => setCancelModal({ show: false, orderId: null, reason: '' })} aria-label="Close">&times;</button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted" style={{ marginBottom: '14px', fontSize: '0.875rem' }}>Share a reason — it will be sent to the buyer in chat.</p>
                                <form onSubmit={handleCancelOrder}>
                                    <div className="form-group">
                                        <label>Reason <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                        <textarea
                                            value={cancelModal.reason}
                                            onChange={e => setCancelModal({ ...cancelModal, reason: e.target.value })}
                                            className="form-input"
                                            required
                                            rows="3"
                                            placeholder="e.g. Out of stock, will restock tomorrow"
                                        ></textarea>
                                    </div>
                                    <div className="modal-actions" style={{ borderTop: 'none', padding: '12px 0 0', background: 'transparent' }}>
                                        <button type="button" onClick={() => setCancelModal({ show: false, orderId: null, reason: '' })} className="btn btn-secondary">Keep order</button>
                                        <button type="submit" className="btn btn-danger">Cancel order</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Route Optimization Modal */}
                {showOptimizeModal && (
                    <RouteOptimizationModal
                        orders={orders}
                        onClose={() => setShowOptimizeModal(false)}
                        onSuccess={(msg) => {
                            success(msg);
                            fetchOrders();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default OrdersManagement;
