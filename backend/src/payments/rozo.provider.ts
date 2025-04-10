import { PaymentProvider, Order, PaymentResult, PaymentStatus, RefundResult } from '../types';

export class RozoPaymentProvider implements PaymentProvider {
    id: string = 'rozo';
    name: string = 'Rozo';
    isActive: boolean = false; // Set to false since it's coming soon
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    config: any;

    constructor(config: any) {
        this.config = config;
    }

    async processPayment(order: Order): Promise<PaymentResult> {
        // Placeholder implementation
        return {
            success: false,
            error: 'Rozo payments are coming soon!'
        };
    }

    async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
        return PaymentStatus.PENDING;
    }

    async processRefund(order: Order, amount?: number): Promise<RefundResult> {
        return {
            success: false,
            error: 'Rozo refunds are not yet implemented'
        };
    }
}