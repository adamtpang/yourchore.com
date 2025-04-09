import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { LaundryService } from './services/laundry/laundry.service';
import { StripePaymentProvider } from './payments/stripe.provider';
import { Service, Vendor, PaymentProvider, OrderStatus } from './types';

const app = express();
app.use(cors());
app.use(express.json());

// Service registry
const services: Record<string, any> = {};
const vendors: Record<string, Vendor> = {};
const paymentProviders: Record<string, PaymentProvider> = {};

// Initialize services
function initializeServices() {
    // Initialize payment providers
    const stripeProvider = new StripePaymentProvider({
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    });
    paymentProviders['stripe'] = stripeProvider;

    // Initialize vendors
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

    // Initialize services
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
}

// API Routes
app.get('/api/services', (_req: Request, res: Response) => {
    const availableServices = Object.values(services)
        .map(service => service.getServiceInfo())
        .filter(service => service.isActive);
    res.json(availableServices);
});

app.get('/api/vendors', (_req: Request, res: Response) => {
    const availableVendors = Object.values(vendors)
        .filter(vendor => vendor.isActive);
    res.json(availableVendors);
});

app.post('/api/orders', async (req: Request, res: Response) => {
    const { serviceId, vendorId, paymentMethodId, ...orderData } = req.body;

    const service = services[serviceId];
    if (!service) {
        return res.status(404).json({ error: 'Service not found' });
    }

    try {
        const order = await service.createOrder({
            ...orderData,
            paymentMethodId
        });
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// Initialize and start server
const PORT = process.env.PORT || 3000;
initializeServices();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});