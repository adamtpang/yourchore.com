import express from 'express';
import cors from 'cors';
import { PaymentController } from './payments/payment.controller';
import { OrderController } from './orders/order.controller';
import { PaymentProviderFactory } from './payments/payment.factory';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { OrderService } from './orders/order.service';
import { OrderStatus } from './types';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://yourchore.com',
            'https://www.yourchore.com',
            'https://yourchorecom-production.up.railway.app'
        ];

        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            console.warn(`Origin ${origin} not allowed by CORS`);
            callback(null, true); // Allow anyway for now to debug
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware - Note: this needs to come before the Stripe webhook middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware - Place after CORS middleware to avoid interfering with OPTIONS requests
app.use((req, res, next) => {
    // Log basic request info
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);

    // Log origin information for debugging CORS
    if (process.env.NODE_ENV === 'production') {
        console.log('Request origin:', req.headers.origin);
        console.log('Request host:', req.headers.host);
        console.log('CORS headers in response:', {
            'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials'),
            'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods')
        });
    }

    // Log detailed info for non-webhook requests
    if (req.method !== 'POST' || req.path !== '/api/stripe-webhook') {
        console.log('Headers:', req.headers);
        console.log('Query:', req.query);
        console.log('Body:', req.body);
    }

    next();
});

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
const orderService = new OrderService();

// Stripe webhook endpoint - NOTE: This must use express.raw() middleware
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = new Stripe(process.env.STRIPE_KEY || 'mock_stripe_key', {
        apiVersion: '2022-11-15',
    });

    let event;

    try {
        if (webhookSecret) {
            // Verify webhook signature
            const signature = req.headers['stripe-signature'] as string;
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                webhookSecret
            );
        } else {
            // For development or when webhook secret is not available
            event = JSON.parse(req.body.toString());
        }

        console.log('Received Stripe webhook event:', event.type);

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('Stripe session data:', session);

            // Get the session details including line items
            const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
                session.id,
                { expand: ['line_items'] }
            );

            const lineItems = sessionWithLineItems.line_items?.data || [];
            const orderItem = lineItems.length > 0 ? lineItems[0] : null;

            // Get the order reference from metadata or generate one
            const orderReference = session.metadata?.orderReference || `order-${Date.now()}`;

            // Extract customer details
            const customerName = session.customer_details?.name || 'Unknown';
            const customerEmail = session.customer_details?.email;

            // Extract information about the purchased service
            const serviceName = orderItem?.description || session.metadata?.service || 'Laundry – 14kg Mixed Load';

            // Calculate amounts
            const totalAmount = session.amount_total ? session.amount_total / 100 : 28; // Convert from cents to dollars
            const royaltyFee = totalAmount * 0.1; // 10% royalty

            // Extract room number and tip amount from metadata (if available)
            const roomNumber = session.metadata?.room || 'Unknown';
            const tipAmount = session.metadata?.tipAmount ? parseFloat(session.metadata.tipAmount) : 0;

            const now = new Date().toISOString();

            // Create the order in the system
            const order = orderService.createOrder({
                id: orderReference,
                name: customerName,
                room: roomNumber,
                service: serviceName,
                amountPaid: totalAmount,
                tipAmount: tipAmount,
                royaltyFee: royaltyFee,
                status: OrderStatus.PENDING,
                paymentMethod: 'stripe',
                time: now,
                totalAmount: totalAmount,
                metadata: {
                    email: customerEmail,
                    paymentId: session.payment_intent,
                    paidAt: now,
                    stripeSessionId: session.id,
                    ...session.metadata
                }
            });

            console.log('Payment successful, order created:', order.id);
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(400).json({ error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
});

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
    console.log(`Server is running on http://localhost:5000`);
    console.log('Available endpoints:');
    console.log('  - GET  /health');
    console.log('  - GET  /api/orders');
    console.log('  - POST /api/orders');
    console.log('  - PUT  /api/orders/:id/status');
    console.log('  - POST /api/stripe-webhook');
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

export default app;