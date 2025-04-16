import express from 'express';
import cors from 'cors';
import { PaymentController } from './payments/payment.controller';
import { OrderController } from './orders/order.controller';
import { PaymentProviderFactory } from './payments/payment.factory';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS to allow requests from frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Initialize payment providers
PaymentProviderFactory.initialize({
    stripe: {
        apiKey: process.env.STRIPE_KEY || 'mock_stripe_key'
    },
    rozo: {
        apiKey: process.env.ROZO_KEY || 'mock_rozo_key'
    }
});

// Initialize controllers
const paymentController = new PaymentController();
const orderController = new OrderController();

// API routes
app.use('/api/payments', paymentController.getRouter());
app.use('/api/orders', orderController.getRouter());

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);

    if (err.type === 'StripeError') {
        return res.status(err.statusCode || 400).json({
            error: err.message
        });
    }

    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(statusCode).json({ error: message });
});

// Start server
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('Available endpoints:');
    console.log('  - GET  /health');
    console.log('  - GET  /api/orders');
    console.log('  - POST /api/orders');
    console.log('  - PUT  /api/orders/:id/status');
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

export default app;