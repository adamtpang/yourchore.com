import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import { LaundryService } from './services/laundry/laundry.service';
import { StripePaymentProvider } from './payments/stripe.provider';
import { Service, Vendor, PaymentProvider } from './types';

// Debug logging
console.log('Starting server with debug info:');
console.log('Current directory:', __dirname);
console.log('Process directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://yourchore.com', 'https://yourchorecom-production.up.railway.app'],
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Debug middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Headers:`, req.headers);
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
        services: ['laundry'],
        royaltyRate: 0.15,
        paymentMethods: ['stripe'],
        config: {}
    };

    const laundryService = new LaundryService({
        service: {
            id: 'laundry',
            name: 'Laundry Service',
            description: 'Professional laundry service',
            isActive: true,
            basePrice: 15,
            config: {}
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
        const { serviceId, paymentMethodId, ...orderData } = req.body;
        const service = services[serviceId];

        if (!service) {
            console.log('Service not found:', serviceId);
            return res.status(404).json({ error: 'Service not found' });
        }

        const order = await service.createOrder({
            ...orderData,
            paymentMethodId
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: Object.keys(services),
        vendors: Object.keys(vendors)
    });
});

// Serve static frontend files AFTER API routes
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Initialize and start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Static files path: ${path.join(__dirname, '../../frontend/dist')}`);
});