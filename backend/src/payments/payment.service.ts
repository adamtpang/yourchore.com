import { PaymentProvider } from '../types';
import { PaymentProviderFactory } from './payment.factory';

// Payment provider interface
export interface PaymentProvider {
    name: string;
    isActive: boolean;
    processorKey: string;
}

// Payment request interface
export interface PaymentRequest {
    amount: number;
    currency: string;
    provider: string;
    customerId?: string;
    description?: string;
    metadata?: Record<string, any>;
}

// Payment response interface
export interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    error?: string;
    provider: string;
    amount: number;
    currency: string;
    timestamp: Date;
}

export class PaymentService {
    constructor() { }

    private paymentProviders: PaymentProvider[] = [
        {
            name: 'stripe',
            isActive: true,
            processorKey: process.env.STRIPE_KEY || 'mock_stripe_key'
        },
        {
            name: 'paypal',
            isActive: true,
            processorKey: process.env.PAYPAL_KEY || 'mock_paypal_key'
        },
        {
            name: 'square',
            isActive: false,
            processorKey: process.env.SQUARE_KEY || 'mock_square_key'
        }
    ];

    // Get all active payment providers
    public getActiveProviders(): PaymentProvider[] {
        return this.paymentProviders.filter(provider => provider.isActive);
    }

    // Validate payment provider
    private validateProvider(providerName: string): boolean {
        const provider = this.paymentProviders.find(p => p.name === providerName);
        return provider ? provider.isActive : false;
    }

    // Process payment
    public async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
        if (!this.validateProvider(request.provider)) {
            return {
                success: false,
                error: `Payment provider ${request.provider} is not available`,
                provider: request.provider,
                amount: request.amount,
                currency: request.currency,
                timestamp: new Date()
            };
        }

        try {
            // Mock successful payment processing
            const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;

            return {
                success: true,
                transactionId,
                provider: request.provider,
                amount: request.amount,
                currency: request.currency,
                timestamp: new Date()
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                provider: request.provider,
                amount: request.amount,
                currency: request.currency,
                timestamp: new Date()
            };
        }
    }

    // Check payment status
    public async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
        // Mock implementation - in real world, would check with actual payment provider
        return {
            success: true,
            transactionId,
            provider: 'stripe', // Example provider
            amount: 0, // Would be actual amount in real implementation
            currency: 'USD',
            timestamp: new Date()
        };
    }

    // Process refund
    public async processRefund(
        transactionId: string,
        amount: number,
        reason?: string
    ): Promise<PaymentResponse> {
        // Mock refund implementation
        return {
            success: true,
            transactionId: `refund_${transactionId}`,
            provider: 'stripe', // Example provider
            amount: amount,
            currency: 'USD',
            timestamp: new Date()
        };
    }

    async getPaymentStatus(providerId: string, paymentId: string) {
        const provider = PaymentProviderFactory.getProvider(providerId);
        if (!provider) {
            throw new Error(`Payment provider ${providerId} not found`);
        }

        return provider.getPaymentStatus(paymentId);
    }

    getAllProviders(): PaymentProvider[] {
        return PaymentProviderFactory.getAllProviders();
    }
}