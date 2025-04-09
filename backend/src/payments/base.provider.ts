import { Order } from '../types';

export interface PaymentProvider {
    // Payment processing
    processPayment(order: Order): Promise<{
        success: boolean;
        transactionId?: string;
        error?: string;
    }>;

    // Payment status
    getPaymentStatus(transactionId: string): Promise<{
        status: string;
        details?: any;
    }>;

    // Refund handling
    processRefund(order: Order, amount?: number): Promise<{
        success: boolean;
        refundId?: string;
        error?: string;
    }>;

    // Provider metadata
    getName(): string;
    isAvailable(): Promise<boolean>;
}