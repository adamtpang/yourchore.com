"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const stripe_1 = __importDefault(require("stripe"));
const uuid_1 = require("uuid");
const laundry_service_1 = require("./services/laundry/laundry.service");
const stripe_provider_1 = require("./payments/stripe.provider");
const types_1 = require("./types");
const order_repository_1 = require("./orders/order-repository");
// Create an instance of the OrderRepository
const orderRepository = new order_repository_1.OrderRepository();
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
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://yourchore.com', 'https://www.yourchore.com', 'https://yourchorecom-production.up.railway.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// For regular JSON requests
app.use(express_1.default.json());
// For Stripe webhooks (raw buffer)
app.use('/api/stripe-webhook', express_1.default.raw({ type: 'application/json' }));
app.use((0, morgan_1.default)('dev'));
// Error handling middleware
app.use((err, req, res, next) => {
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
const services = {};
const vendors = {};
const paymentProviders = {};
// Initialize services
function initializeServices() {
    console.log('Initializing services...');
    const stripeProvider = new stripe_provider_1.StripePaymentProvider({
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    });
    vendors['angie'] = {
        id: 'angie',
        name: "Angie's Laundry",
        description: 'Professional laundry service',
        isActive: true,
        services: [types_1.ServiceType.LAUNDRY],
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
    const laundryService = new laundry_service_1.LaundryService({
        service: {
            id: 'laundry',
            name: 'Laundry Service',
            description: 'Professional laundry service',
            isActive: true,
            basePrice: 15,
            type: types_1.ServiceType.LAUNDRY,
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Order creation failed:', error);
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Stripe webhook endpoint for handling checkout sessions
app.post('/api/stripe-webhook', async (req, res) => {
    var _a;
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2022-11-15',
    });
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('Stripe webhook secret is not configured');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }
    try {
        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
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
                if (orderReference) {
                    // Check if order already exists
                    let existingOrder;
                    try {
                        existingOrder = orderRepository.findById(orderReference);
                        if (existingOrder) {
                            console.log('Found existing order:', existingOrder);
                            // Update order status to Pending
                            orderRepository.update({
                                ...existingOrder,
                                status: types_1.OrderStatus.PENDING
                            });
                            res.json({ received: true, orderId: existingOrder.id });
                            return;
                        }
                    }
                    catch (err) {
                        console.log('Error finding order:', err);
                    }
                }
                // Create a new order
                const newOrder = {
                    id: (0, uuid_1.v4)(),
                    name: customerName,
                    room: roomNumber,
                    service: 'Laundry',
                    amountPaid: session.amount_total ? session.amount_total / 100 : 0,
                    tipAmount: 0, // Need to extract this from session if available
                    royaltyFee: 0, // Calculate based on policy
                    status: types_1.OrderStatus.PENDING,
                    paymentMethod: 'stripe',
                    time: new Date().toISOString(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    totalAmount: session.amount_total ? session.amount_total / 100 : 0,
                    metadata: {
                        stripeSessionId: session.id,
                        customerEmail: (_a = session.customer_details) === null || _a === void 0 ? void 0 : _a.email,
                        // Add other relevant data
                    }
                };
                // Save order to repository
                orderRepository.create(newOrder);
                console.log('New order created:', newOrder.id);
                break;
            }
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                console.log('PaymentIntent succeeded:', paymentIntent.id);
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                console.log('PaymentIntent failed:', paymentIntent.id);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        // Return a 200 response to acknowledge receipt of the event
        res.json({ received: true });
    }
    catch (error) {
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
        const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
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
        const existingOrder = orderRepository.findById(orderReference);
        if (existingOrder) {
            const updatedOrder = orderRepository.update({
                ...existingOrder,
                metadata: {
                    ...existingOrder.metadata,
                    checkoutSessionId: session.id,
                    checkoutInitiated: true,
                    checkoutTime: new Date().toISOString()
                }
            });
        }
        res.json({
            url: session.url,
            sessionId: session.id
        });
    }
    catch (error) {
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
        const orders = orderRepository.findAll();
        res.json(orders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            error: 'Error fetching orders',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get a single order
app.get('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const orderReference = id;
    try {
        const existingOrder = orderRepository.findById(orderReference);
        if (!existingOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(existingOrder);
    }
    catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            error: 'Error fetching order',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Update order status
app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const existingOrder = orderRepository.findById(id);
        if (!existingOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const updatedOrder = orderRepository.update({
            ...existingOrder,
            status: status,
            updatedAt: new Date()
        });
        res.json(updatedOrder);
    }
    catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            error: 'Error updating order status',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
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
const staticPath = path_1.default.join(__dirname, '../../frontend/dist');
console.log(`Static files path: ${staticPath}`);
app.use(express_1.default.static(staticPath));
// Handle all other routes by serving the index.html
// This enables client-side routing to work properly
app.get('*', (req, res) => {
    // Don't interfere with API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    console.log(`Serving index.html for path: ${req.path}`);
    res.sendFile(path_1.default.join(__dirname, '../../frontend/dist/index.html'));
});
// Initialize and start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Static files path: ${path_1.default.join(__dirname, '../../frontend/dist')}`);
});
// Handle server errors
server.on('error', (error) => {
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
