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
export interface Order extends BaseEntity {
    serviceId: string;
    vendorId: string;
    customerId: string;
    status: OrderStatus;
    items: OrderItem[];
    totalAmount: number;
    royaltyFee: number;
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    paymentDetails?: any;
    metadata: {
        [key: string]: any;
    };
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

export enum OrderStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    PICKED_UP = 'picked_up',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export enum PaymentStatus {
    PENDING = 'pending',
    AUTHORIZED = 'authorized',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

// Payment related types
export interface PaymentProvider extends BaseEntity {
    name: string;
    isActive: boolean;
    config: any;
    processPayment(order: Order): Promise<PaymentResult>;
    getPaymentStatus(transactionId: string): Promise<PaymentStatus>;
    processRefund(order: Order, amount?: number): Promise<RefundResult>;
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