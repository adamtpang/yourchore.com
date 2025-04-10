import { Service, ServiceType } from '../../types';

export const laundryServiceConfig: Service = {
    id: 'laundry',
    name: 'Laundry Service',
    description: 'Professional laundry service with wash, dry, and fold options',
    isActive: true,
    type: ServiceType.LAUNDRY,
    basePrice: 15.00,
    createdAt: new Date(),
    updatedAt: new Date(),
    config: {
        allowedPaymentMethods: ['stripe', 'rozo'],
        pricing: {
            base: 15.00,
            perPound: 2.50,
            minimumWeight: 5,
            rushService: 10.00,
        },
        options: {
            serviceTypes: [
                {
                    id: 'wash-and-fold',
                    name: 'Wash & Fold',
                    description: 'Regular laundry service with washing, drying, and folding',
                    basePrice: 15.00,
                },
                {
                    id: 'dry-clean',
                    name: 'Dry Clean',
                    description: 'Professional dry cleaning service for delicate items',
                    basePrice: 25.00,
                },
                {
                    id: 'iron-only',
                    name: 'Iron Only',
                    description: 'Professional ironing service for your clothes',
                    basePrice: 12.00,
                },
            ],
            addons: [
                {
                    id: 'rush',
                    name: 'Rush Service',
                    description: 'Same day service',
                    price: 10.00,
                },
                {
                    id: 'eco',
                    name: 'Eco-Friendly',
                    description: 'Using environmentally friendly detergents',
                    price: 5.00,
                },
            ],
        },
    },
};