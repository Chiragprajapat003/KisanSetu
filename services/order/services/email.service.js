const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 3000,
        greetingTimeout: 3000,
        socketTimeout: 4000
    });
};

// Verify Email Configuration
const verifyEmailConfig = async () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS.includes('your_app')) {
        console.log('ℹ️ Email credentials not configured. Email service will run in dev/console mode.');
        return false;
    }
    console.log('📧 Verifying Email Configuration...');
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Email Service Configured & Connected');
        return true;
    } catch (error) {
        console.error('❌ Email Service Configuration Failed:', error.message);
        return false;
    }
};

// Send OTP email
const sendOTP = async (email, otp, orderDetails) => {
    console.log(`📧 Attempting to send OTP to: ${email}`);
    
    // If credentials are not set or default placeholder, log to console and return true without hanging
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS.includes('your_app') || process.env.EMAIL_USER.includes('your_email')) {
        console.log(`⚠️ SMTP credentials not set. Console OTP Fallback: ${otp} for ${email}`);
        return true;
    }

    try {
        const transporter = createTransporter();

        await transporter.sendMail({
            from: `"AgriDirect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Order OTP - AgriDirect',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2e7d32;">🌾 AgriDirect Order Verification</h2>
                    <p>Your order has been placed successfully!</p>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0;">Order Details:</h3>
                        <p><strong>Product:</strong> ${orderDetails.productName}</p>
                        <p><strong>Quantity:</strong> ${orderDetails.quantity}</p>
                        <p><strong>Total:</strong> ₹${orderDetails.totalPrice}</p>
                    </div>
                    <div style="background: #2e7d32; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                        <h3 style="margin: 0;">Your OTP</h3>
                        <p style="font-size: 32px; letter-spacing: 8px; margin: 10px 0;">${otp}</p>
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">
                        Please use this OTP to verify your order. Do not share this with anyone.
                    </p>
                </div>
            `
        });

        console.log(`✅ OTP sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        return false;
    }
};

// Send order confirmation
const sendOrderConfirmation = async (email, order) => {
    try {
        const transporter = createTransporter();

        await transporter.sendMail({
            from: `"AgriDirect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Order Confirmed - AgriDirect',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2e7d32;">✅ Order Confirmed!</h2>
                    <p>Your order has been verified and is being processed.</p>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>Total:</strong> ₹${order.totalPrice}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                    </div>
                    <p>You will receive updates as your order progresses.</p>
                </div>
            `
        });

        return true;
    } catch (error) {
        console.error('❌ Confirmation email error:', error.message);
        return false;
    }
};

// Send status update
const sendStatusUpdate = async (email, order, newStatus) => {
    try {
        const transporter = createTransporter();

        const statusMessages = {
            processing: 'Your order is being prepared',
            shipping: 'Your order is out for delivery',
            delivered: 'Your order has been delivered',
            cancelled: 'Your order has been cancelled'
        };

        await transporter.sendMail({
            from: `"AgriDirect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Order Update: ${newStatus} - AgriDirect`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2e7d32;">📦 Order Update</h2>
                    <p>${statusMessages[newStatus] || 'Your order status has been updated'}</p>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>New Status:</strong> ${newStatus}</p>
                    </div>
                </div>
            `
        });

        return true;
    } catch (error) {
        console.error('❌ Status update email error:', error.message);
        return false;
    }
};

module.exports = { sendOTP, sendOrderConfirmation, sendStatusUpdate, verifyEmailConfig };
