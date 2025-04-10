import { Vendor, ServiceType } from '../types';

export const vendors: Record<string, Vendor> = {
    angie: {
        id: 'angie',
        name: "Angie's Laundry",
        description: 'Professional laundry service with years of experience',
        isActive: true,
        services: [ServiceType.LAUNDRY],
        royaltyRate: 0.15,
        paymentMethods: ['stripe', 'rozo'],
        createdAt: new Date(),
        updatedAt: new Date(),
        contactInfo: {
            email: 'angie@yourchore.com',
            phone: '(555) 123-4567',
            address: '123 Campus Drive'
        },
        config: {
            serviceSpecificConfig: {
                [ServiceType.LAUNDRY]: {
                    maxCapacityPerDay: 100, // pounds
                    turnaroundTime: 24, // hours
                    deliveryZones: ['campus-north', 'campus-south'],
                }
            },
            operatingHours: {
                monday: { open: '08:00', close: '18:00' },
                tuesday: { open: '08:00', close: '18:00' },
                wednesday: { open: '08:00', close: '18:00' },
                thursday: { open: '08:00', close: '18:00' },
                friday: { open: '08:00', close: '18:00' },
                saturday: { open: '09:00', close: '16:00' },
                sunday: { open: '10:00', close: '14:00' }
            }
        }
    }
};