import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { LaundryService } from './services/laundry/laundry.service';
import { StripePaymentProvider } from './payments/stripe.provider';
import { Service, Vendor, PaymentProvider } from './types';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Service registry
const services: Record<string, any> = {};
const vendors: Record<string, Vendor> = {};
const paymentProviders: Record<string, PaymentProvider> = {};

// Initialize services
function initializeServices() {
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
}

// API Routes
app.get('/api/services', (req, res) => {
    const availableServices = Object.values(services)
        .map(service => service.getServiceInfo())
        .filter(service => service.isActive);
    res.json(availableServices);
});

app.get('/api/vendors', (req, res) => {
    const availableVendors = Object.values(vendors)
        .filter(vendor => vendor.isActive);
    res.json(availableVendors);
});

app.post('/api/orders', async (req, res) => {
    try {
        const { serviceId, paymentMethodId, ...orderData } = req.body;
        const service = services[serviceId];

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const order = await service.createOrder({
            ...orderData,
            paymentMethodId
        });

        res.json(order);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Initialize and start server
const PORT = process.env.PORT || 3000;
initializeServices();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});