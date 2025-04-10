import Stripe from 'stripe';
import { PaymentProvider, Order, PaymentResult, PaymentStatus, RefundResult } from '../types';

export class StripePaymentProvider implements PaymentProvider {
    private stripe: Stripe;
    id: string = 'stripe';
    name: string = 'Stripe';
    isActive: boolean = true;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    config: any;

    constructor(config: { secretKey: string; webhookSecret?: string }) {
        this.config = config;
        this.stripe = new Stripe(config.secretKey, { apiVersion: '2022-11-15' });
    }

    async processPayment(order: Order): Promise<PaymentResult> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(order.totalAmount * 100), // Convert to cents
                currency: 'usd',
                metadata: {
                    orderId: order.id,
                    serviceId: order.serviceId,
                    vendorId: order.vendorId
                }
            });
            return {
                success: true,
                transactionId: paymentIntent.id,
                details: paymentIntent
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(transactionId);
            switch (paymentIntent.status) {
                case 'succeeded':
                    return PaymentStatus.PAID;
                case 'requires_payment_method':
                case 'requires_confirmation':
                case 'requires_action':
                    return PaymentStatus.PENDING;
                case 'processing':
                    return PaymentStatus.AUTHORIZED;
                case 'canceled':
                    return PaymentStatus.FAILED;
                default:
                    return PaymentStatus.PENDING;
            }
        } catch (error) {
            console.error('Error getting payment status:', error);
            return PaymentStatus.FAILED;
        }
    }

    async processRefund(order: Order, amount?: number): Promise<RefundResult> {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: order.paymentDetails?.transactionId,
                amount: amount ? Math.round(amount * 100) : undefined
            });
            return {
                success: true,
                refundId: refund.id,
                details: refund
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    getName(): string {
        return this.name;
    }

    async isAvailable(): Promise<boolean> {
        try {
            await this.stripe.paymentMethods.list({ limit: 1 });
            return true;
        } catch {
            return false;
        }
    }
}
