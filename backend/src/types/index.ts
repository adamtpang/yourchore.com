// Base interfaces
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// Service related types
export interface Service extends BaseEntity {
    name: string;
    description: string;
    isActive: boolean;
    basePrice: number;
    type: ServiceType;
    config: ServiceConfig;
}

export enum ServiceType {
    LAUNDRY = 'laundry',
    FOOD = 'food',
    CLEANING = 'cleaning',
    ERRANDS = 'errands'
}

export interface ServiceConfig {
    allowedPaymentMethods: string[];
    pricing: {
        base: number;
        [key: string]: any;
    };
    options?: {
        [key: string]: any;
    };
}

// Vendor related types
export interface Vendor extends BaseEntity {
    name: string;
    description: string;
    isActive: boolean;
    services: ServiceType[];
    royaltyRate: number;
    paymentMethods: string[];
    config: VendorConfig;
    contactInfo: ContactInfo;
}

export interface VendorConfig {
    serviceSpecificConfig?: {
        [key in ServiceType]?: any;
    };
    operatingHours?: OperatingHours;
    [key: string]: any;
}

export interface ContactInfo {
    email: string;
    phone?: string;
    address?: string;
}

export interface OperatingHours {
    [key: string]: {
        open: string;
        close: string;
    };
}

// Order related types
export enum OrderStatus {
    PENDING = 'Pending',
    PICKED_UP = 'Picked Up',
    DELIVERED = 'Delivered'
}

export enum PaymentStatus {
    PENDING = 'Pending',
    AUTHORIZED = 'Authorized',
    PAID = 'Paid',
    FAILED = 'Failed',
    REFUNDED = 'Refunded'
}

export interface Order {
    id: string;
    name: string;
    room: string;
    service: string;
    amountPaid: number;
    tipAmount: number;
    royaltyFee: number;
    status: OrderStatus;
    paymentMethod: string;
    time: string;
    createdAt: Date;
    updatedAt: Date;
    totalAmount: number;
    metadata?: Record<string, any>;
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    options?: {
        [key: string]: any;
    };
}

// Payment related types
export interface PaymentProvider {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    config: any;
    processPayment(order: Order): Promise<PaymentResult>;
    getPaymentStatus(transactionId: string): Promise<PaymentStatus>;
    processRefund(order: Order, amount?: number): Promise<RefundResult>;
    getName(): string;
    isAvailable(): Promise<boolean>;
}

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
    details?: any;
}

export interface RefundResult {
    success: boolean;
    refundId?: string;
    error?: string;
    details?: any;
}

// Customer related types
export interface Customer extends BaseEntity {
    name: string;
    email: string;
    phone?: string;
    room?: string;
    preferences?: {
        [key: string]: any;
    };
    paymentMethods?: SavedPaymentMethod[];
}

export interface SavedPaymentMethod {
    id: string;
    type: string;
    lastFour?: string;
    expiryDate?: string;
    isDefault: boolean;
}