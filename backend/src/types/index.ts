export interface Service {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    basePrice: number;
    config: Record<string, any>;
}

export interface Vendor {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    services: string[]; // Service IDs this vendor supports
    royaltyRate: number; // Percentage of order total (0-1)
    paymentMethods: string[]; // Supported payment provider IDs
    config: Record<string, any>;
}

export interface PaymentProvider {
    id: string;
    name: string;
    isActive: boolean;
    config: Record<string, any>;
}

export interface Order {
    id: string;
    serviceId: string;
    vendorId: string;
    paymentMethodId: string;
    status: OrderStatus;
    totalAmount: number;
    royaltyFee: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface ServiceConfig {
    service: Service;
    vendor: Vendor;
    paymentProvider: PaymentProvider;
}