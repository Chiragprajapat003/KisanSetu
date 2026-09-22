require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const conversationRoutes = require('./routes/conversation.routes');
const { errorHandler } = require('../shared/middleware/errorHandler');
const { setupSocketHandlers } = require('./services/socket.service');

const app = express();
const server = http.createServer(app);
// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const allowedOrigins = process.env.FRONTEND_URL 
            ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
            : ['http://localhost:5173', 'http://127.0.0.1:5173'];
        
        const cleanOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes('*') || cleanOrigin.endsWith('.vercel.app') || process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true
};

// Socket.io setup
const io = new Server(server, {
    cors: corsOptions
});

// Make io available globally
global.io = io;

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
}));

// Health check
app.get('/health', (req, res) => {
    res.json({
        service: 'communication-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        connections: io.engine.clientsCount
    });
});

// Routes
app.use('/api/conversations', conversationRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agridirect');
        console.log('✅ Communication Service: MongoDB connected');

        // Setup socket handlers
        setupSocketHandlers(io);

        server.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Communication Service running on port ${PORT}`);
            console.log(`📡 WebSocket server ready`);
        });
    } catch (error) {
        console.error('❌ Communication Service failed to start:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = { app, io };
