import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { createOrder, verifyOTP } from '../../services/order.service';


import { createPaymentOrder } from '../../services/payment.service';
import PaymentOptions from '../../components/payment/PaymentOptions';

import RazorpayCheckout from '../../components/payment/RazorpayCheckout';
import QRCodeModal from '../../components/payment/QRCodeModal.jsx';
import Toast, { useToast } from '../../components/shared/Toast.jsx';
import './Buyer.css';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, subtotal, tax, total, itemCount } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('cart'); // cart, payment, success, verify_otp
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [createdOrder, setCreatedOrder] = useState(null);
    const { toasts, success, error } = useToast();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [devOtp, setDevOtp] = useState('');
    const [verifying, setVerifying] = useState(false);

    // Check if farmer accepts cash (simplified: check if ANY product is from a farmer who accepts cash)
    // For MVP, we'll fetch this preference or assume true if mixed cart
    const [farmerAcceptsCash, setFarmerAcceptsCash] = useState(true);

    useEffect(() => {
        if (cart.length > 0) {
            // Future enhancement: Check specific farmer preference
            setFarmerAcceptsCash(true);
        }
    }, [cart]);

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 4) {
            error('Please enter a valid 4-digit OTP');
            return;
        }

        setVerifying(true);
        try {
            // Need to verify OTP for each order if multiple created (MVP: just first one)
            // Or better: Verify OTP for the "batch" if backed supports it.
            // Current backend: verify per order.

            // Logic: If multiple orders, verify them sequentially or map them.
            // For now, let's assume one order for simplicity or just verify the first one to unblock the flow
            // But real logic should prompt verification for each farmer's order or backend should handle batch verification.

            // Since `createdOrder` could be one order or array, let's look at responseData.orders from handleCreateOrder
            // We need to persist that data to state. Let's update handleCreateOrder to setCreatedOrder appropriately.

            const orderId = createdOrder._id || createdOrder.orders?.[0]?._id; // Fallback

            if (!orderId) throw new Error("No order ID to verify");

            const res = await verifyOTP(orderId, otp);
            const data = res.data;


            if (data.success) {
                success('Order verified! Thank you.');
                clearCart();
                setStep('success');
                setTimeout(() => navigate('/buyer/orders'), 2000);
            } else {
                error(data.message || 'OTP Verification failed');
            }

        } catch (err) {
            console.error(err);
            error('Verification failed. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const handleCreateOrder = async () => {
        console.log('🛒 handleCreateOrder called');
        console.log('Current cart:', cart);

        if (cart.length === 0) {
            console.warn('Cart is empty, aborting');
            return;
        }

        setLoading(true);
        try {
            const orderItems = cart
                .filter(item => (item.product?._id || item.product))
                .map(item => {
                    const pId = item.product?._id || item.product;
                    return {
                        productId: pId,
                        quantity: item.quantity
                    };
                });

            if (orderItems.length === 0) {
                error('Your cart has no valid products. Please add items to cart.');
                setLoading(false);
                return;
            }

            const orderData = {
                items: orderItems,
                paymentMethod
            };

            console.log('📦 Sending Order Data:', JSON.stringify(orderData, null, 2));

            // 1. Create Order via Order Service
            console.log('🚀 Calling createOrder API...');
            const orderRes = await createOrder(orderData);
            console.log('✅ API Response:', orderRes);

            const responseData = orderRes.data;

            const ordersList = responseData.orders || [responseData.order];

            if (ordersList.length === 0) throw new Error('No orders created');

            // Save created order(s) to state
            setCreatedOrder(ordersList[0]); // Just track one for MVP verification flow for now

            const receivedOtp = responseData.devOtp || ordersList[0]?.devOtp;
            if (receivedOtp) {
                console.log('%c====================================', 'color: #10b981; font-weight: bold;');
                console.log('%c🔑 YOUR ORDER OTP CODE IS: ' + receivedOtp, 'background: #047857; color: #ffffff; font-size: 22px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
                console.log('%c====================================', 'color: #10b981; font-weight: bold;');
                setDevOtp(receivedOtp);
                setOtp(receivedOtp); // Pre-fill for instant testability
                success(`🔑 Order OTP: ${receivedOtp}`);
            }


            if (paymentMethod === 'cash') {
                console.log('💰 Cash Payment - OTP Flow');

                // Ensure Payment Record is created for Cash Orders too
                const createdOrderId = responseData.orders && responseData.orders.length > 0
                    ? responseData.orders[0]._id
                    : (responseData.order ? responseData.order._id : null);

                if (createdOrderId) {
                    try {
                        await createPaymentOrder({
                            orderId: createdOrderId,
                            paymentMethod: 'cash'
                        });
                        console.log('✅ Cash Payment Record Created');
                    } catch (payErr) {
                        console.error('⚠️ Failed to create cash payment record:', payErr);
                    }
                }

                // Show OTP Input Step
                setStep('verify_otp');
                success('Order placed! Check your email for OTP.');
            } else {
                console.log('💳 Online Payment Flow');
                // Online Payment
                const createdOrderId = responseData.orders && responseData.orders.length > 0
                    ? responseData.orders[0]._id
                    : (responseData.order ? responseData.order._id : null);

                if (!createdOrderId) {
                    console.error('❌ Order Response missing ID:', responseData);
                    throw new Error('Failed to retrieve order ID from response');
                }

                const paymentRes = await createPaymentOrder({
                    orderId: createdOrderId,
                    paymentMethod: 'online'
                });

                const paymentData = paymentRes.data;

                if (paymentData.success) {
                    setCreatedOrder(paymentData);
                    setStep('payment'); // Show Razorpay button
                } else {
                    error(paymentData.message || 'Failed to initiate payment');
                }
            }


        } catch (err) {
            console.error('❌ Checkout Error:', err);
            const errMsg = err.response?.data?.message || err.message || 'Checkout failed';
            // alert(`DEBUG ERROR: ${errMsg}`); // Force user to see error
            error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (details) => {
        success('Payment successful! Order confirmed.');
        clearCart();
        navigate('/buyer/orders');
    };

    const handlePaymentError = (msg) => {
        error(msg);
        // Maybe redirect to orders page with 'pending' payment status
    };

    if (itemCount === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything yet</p>
                        <Link to="/buyer/browse" className="btn btn-primary">Start Shopping</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <Toast toasts={toasts} />
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Shopping Cart</h1>
                    <p className="page-subtitle">{itemCount} item(s) in your cart</p>
                </div>

                <div className="cart-layout">
                    {/* Cart Items List */}
                    <div className="cart-items">
                        {cart.filter(item => item.product && item.product._id).map(item => {
                            const itemPrice = item.price || item.product?.price || 0;
                            return (
                                <div key={item.product._id} className="cart-item card">
                                    <img src={item.product?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                                        alt={item.product?.productName} className="cart-item-img" />
                                    <div className="cart-item-info">
                                        <h3>{item.product?.productName}</h3>
                                        <p className="cart-item-farmer">by {item.product?.ownerName}</p>
                                        <p className="cart-item-price">₹{itemPrice}/kg</p>
                                    </div>
                                    <div className="cart-item-controls">
                                        <div className="quantity-selector">
                                            <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="qty-btn">-</button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="qty-btn">+</button>
                                        </div>
                                        <div className="cart-item-total">₹{itemPrice * item.quantity}</div>
                                        <button onClick={() => removeFromCart(item.product._id)} className="remove-btn">🗑️</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary & Payment */}
                    <div className="cart-summary card">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal ({itemCount} items)</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (5%)</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>

                        {step === 'cart' && (
                            <>
                                <hr style={{ margin: '1.5rem 0', borderColor: 'var(--color-border)' }} />
                                <PaymentOptions
                                    selectedMethod={paymentMethod}
                                    onSelect={setPaymentMethod}
                                    farmerAcceptsCash={farmerAcceptsCash}
                                />

                                <button
                                    onClick={handleCreateOrder}
                                    className="btn btn-primary btn-full btn-lg"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : (paymentMethod === 'online' ? 'Proceed to Pay' : 'Place Cash Order')}
                                </button>
                            </>
                        )}

                        {step === 'verify_otp' && (
                            <div className="otp-verification-step" style={{ textAlign: 'center', padding: '1rem' }}>
                                <h3>Verify Your Order</h3>
                                <p style={{ color: '#666', marginBottom: '1rem' }}>
                                    We sent a 4-digit code to your email.<br />
                                    Please enter it below to confirm your Cash on Delivery order.
                                </p>

                                {devOtp && (
                                    <div style={{
                                        background: '#ecfdf5',
                                        border: '1px solid #10b981',
                                        borderRadius: '8px',
                                        padding: '10px 14px',
                                        marginBottom: '1rem',
                                        color: '#065f46',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>
                                        🔑 Demo / Local OTP: <span style={{ fontSize: '1.1rem', letterSpacing: '2px', color: '#047857' }}>{devOtp}</span>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="Enter 4-digit OTP"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '1.2rem',
                                        letterSpacing: '5px',
                                        textAlign: 'center',
                                        marginBottom: '1rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px'
                                    }}
                                />

                                <button
                                    onClick={handleVerifyOTP}
                                    disabled={verifying || otp.length !== 4}
                                    className="btn btn-primary btn-full"
                                >
                                    {verifying ? 'Verifying...' : 'Verify & Confirm Order'}
                                </button>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="success-message">
                                <h3 style={{ color: 'green' }}>🎉 Order Confirmed!</h3>
                                <p>Redirecting you to orders...</p>
                            </div>
                        )}

                        {step === 'payment' && createdOrder && (
                            <div className="payment-step-container">
                                <p style={{ marginBottom: '1rem', color: '#666', textAlign: 'center' }}>
                                    Order created! Select payment method.
                                </p>

                                {paymentMethod === 'online' && (
                                    <>
                                        <RazorpayCheckout
                                            orderDetails={createdOrder}
                                            onSuccess={handlePaymentSuccess}
                                            onError={handlePaymentError}
                                            user={user}
                                        />

                                        <div style={{ margin: '1rem 0', textAlign: 'center', color: '#999' }}>- OR -</div>

                                        <button
                                            onClick={() => setStep('qr_payment')}
                                            className="btn btn-secondary btn-full"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        >
                                            📱 Pay via UPI QR Code
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {step === 'qr_payment' && createdOrder && (
                            <QRCodeModal
                                orderDetails={createdOrder}
                                onClose={() => setStep('payment')}
                                onSuccess={handlePaymentSuccess}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
