import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { LaundryService } from './services/laundry/laundry.service';
import { StripePaymentProvider } from './payments/stripe.provider';
import { Service, Vendor, PaymentProvider, ServiceType } from './types';
import { orderRepository, ChoreOrder } from './orders/order-repository';

// Debug logging
console.log('Starting server with debug info:');
console.log('Current directory:', __dirname);
console.log('Process directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://yourchore.com', 'https://www.yourchore.com', 'https://yourchorecom-production.up.railway.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// For regular JSON requests
app.use(express.json());

// For Stripe webhooks (raw buffer)
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));
app.use(morgan('dev'));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Debug middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    if (req.method !== 'POST' || req.path !== '/api/stripe-webhook') {
        // Don't log body for Stripe webhooks to avoid leaking sensitive data
        console.log('Body:', req.body);
    }
    next();
});

// Root health check
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'YourChore API is running',
        env: process.env.NODE_ENV,
        cwd: process.cwd(),
        dirname: __dirname,
        node_version: process.version,
        timestamp: new Date().toISOString()
    });
});

// Service registry
const services: Record<string, any> = {};
const vendors: Record<string, Vendor> = {};
const paymentProviders: Record<string, PaymentProvider> = {};

// Initialize services
function initializeServices() {
    console.log('Initializing services...');

    const stripeProvider = new StripePaymentProvider({
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    });

    vendors['angie'] = {
        id: 'angie',
        name: "Angie's Laundry",
        description: 'Professional laundry service',
        isActive: true,
        services: [ServiceType.LAUNDRY],
        royaltyRate: 0.15,
        paymentMethods: ['stripe'],
        config: {
            operatingHours: {
                monday: { open: '08:00', close: '20:00' },
                tuesday: { open: '08:00', close: '20:00' },
                wednesday: { open: '08:00', close: '20:00' },
                thursday: { open: '08:00', close: '20:00' },
                friday: { open: '08:00', close: '20:00' }
            }
        },
        contactInfo: {
            email: 'info@angieslaundry.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const laundryService = new LaundryService({
        service: {
            id: 'laundry',
            name: 'Laundry Service',
            description: 'Professional laundry service',
            isActive: true,
            basePrice: 15,
            type: ServiceType.LAUNDRY,
            config: {
                allowedPaymentMethods: ['stripe'],
                pricing: {
                    base: 15
                }
            },
            createdAt: new Date(),
            updatedAt: new Date()
        },
        vendor: vendors['angie'],
        paymentProvider: stripeProvider
    });

    services['laundry'] = laundryService;
    paymentProviders['stripe'] = stripeProvider;

    console.log('Services initialized:', Object.keys(services));
    console.log('Vendors initialized:', Object.keys(vendors));
}

// Initialize services before setting up routes
initializeServices();

// API Routes
app.get('/api/services', (req, res) => {
    console.log('GET /api/services - Available services:', Object.keys(services));
    try {
        const availableServices = Object.values(services)
            .map(service => service.getServiceInfo())
            .filter(service => service.isActive);
        console.log('Sending services:', availableServices);
        res.json(availableServices);
    } catch (error) {
        console.error('Error in /api/services:', error);
        res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});

app.get('/api/vendors', (req, res) => {
    console.log('GET /api/vendors - Available vendors:', Object.keys(vendors));
    try {
        const availableVendors = Object.values(vendors)
            .filter(vendor => vendor.isActive);
        res.json(availableVendors);
    } catch (error) {
        console.error('Error in /api/vendors:', error);
        res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});

app.post('/api/orders', async (req, res) => {
    console.log('POST /api/orders - Creating order:', req.body);
    try {
        const { serviceId, paymentMethod, ...orderData } = req.body;
        const service = services[serviceId];

        if (!service) {
            console.log('Service not found:', serviceId);
            return res.status(404).json({ error: 'Service not found' });
        }

        const order = await service.createOrder({
            ...orderData,
            paymentMethod
        });

        console.log('Order created:', order.id);
        res.json(order);
    } catch (error) {
        console.error('Order creation failed:', error);
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Stripe webhook endpoint for handling checkout sessions
app.post('/api/stripe-webhook', async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2022-11-15',
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('Stripe webhook secret is not configured');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    try {
        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('Payment succeeded:', session);

                // Extract customer information
                let customerName = 'Guest';
                let roomNumber = 'Not specified';
                let orderReference = '';

                if (session.customer_details) {
                    customerName = session.customer_details.name || 'Guest';
                }

                // Extract service information and metadata
                if (session.metadata) {
                    roomNumber = session.metadata.room || 'Not specified';
                    orderReference = session.metadata.orderReference || '';
                }

                // Get payment details
                const amountPaid = session.amount_total ? session.amount_total / 100 : 0; // Convert from cents
                const royaltyFee = amountPaid * 0.10; // 10% royalty

                // Look for existing order reference if provided
                let existingOrder = null;
                if (orderReference) {
                    existingOrder = orderRepository.getOrderById(orderReference);
                }

                if (existingOrder) {
                    // Update existing order with payment information
                    existingOrder.status = 'Pending';
                    existingOrder.metadata = {
                        ...existingOrder.metadata,
                        stripeSessionId: session.id,
                        paymentIntent: session.payment_intent,
                        customerEmail: session.customer_details?.email,
                        paymentStatus: 'paid',
                        paidAt: new Date().toISOString()
                    };

                    orderRepository.updateOrderStatus(existingOrder.id, 'Pending');
                    console.log('Order updated with payment:', existingOrder.id);
                } else {
                    // Create a new order
                    const newOrder: ChoreOrder = {
                        id: uuidv4(),
                        name: customerName,
                        room: roomNumber,
                        service: '14kg Mixed Load', // Default service
                        time: new Date().toISOString(),
                        amountPaid,
                        royalty: royaltyFee,
                        status: 'Pending',
                        paymentMethod: 'stripe',
                        metadata: {
                            stripeSessionId: session.id,
                            paymentIntent: session.payment_intent,
                            customerEmail: session.customer_details?.email,
                            paymentStatus: 'paid',
                            paidAt: new Date().toISOString()
                        }
                    };

                    // Store the order
                    orderRepository.addOrder(newOrder);
                    console.log('New order created from payment:', newOrder.id);

                    // Here you would typically send an email confirmation
                    // This would be implemented with an email service
                }

                break;
            }
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('PaymentIntent succeeded:', paymentIntent.id);
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('PaymentIntent failed:', paymentIntent.id);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        res.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Error processing webhook' });
    }
});

// Create Stripe checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
    console.log('POST /api/create-checkout-session - Creating session:', req.body);
    try {
        const { service, price, name, room, orderId, orderReference, successUrl, cancelUrl } = req.body;

        // Initialize Stripe
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2022-11-15',
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${service} Laundry Service`,
                            description: `Laundry service for ${name} (Room: ${room})`,
                        },
                        unit_amount: Math.round(price * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                orderId,
                orderReference,
                service,
                room,
                name
            },
            customer_email: req.body.email,
        });

        // Update the order in the repository to mark that checkout has been initiated
        const existingOrder = orderRepository.getOrderById(orderReference);
        if (existingOrder) {
            existingOrder.metadata = {
                ...existingOrder.metadata,
                checkoutSessionId: session.id,
                checkoutInitiated: true,
                checkoutTime: new Date().toISOString()
            };
        }

        res.json({
            url: session.url,
            sessionId: session.id
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({
            error: 'Failed to create checkout session',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get all orders - for admin dashboard
app.get('/api/orders', (req, res) => {
    try {
        const orders = orderRepository.getOrders();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            error: 'Error fetching orders',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Picked Up', 'Delivered'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Valid values are: Pending, Picked Up, Delivered' });
    }

    const updatedOrder = orderRepository.updateOrderStatus(id, status);
    if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: Object.keys(services),
        vendors: Object.keys(vendors)
    });
});

// Setup static file serving
const staticPath = path.join(__dirname, '../../frontend/dist');
console.log(`Static files path: ${staticPath}`);
app.use(express.static(staticPath));

// Handle all other routes by serving the index.html
// This enables client-side routing to work properly
app.get('*', (req, res) => {
    // Don't interfere with API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    console.log(`Serving index.html for path: ${req.path}`);
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Initialize and start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Static files path: ${path.join(__dirname, '../../frontend/dist')}`);
});

// Handle server errors
server.on('error', (error: any) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${PORT} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${PORT} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});