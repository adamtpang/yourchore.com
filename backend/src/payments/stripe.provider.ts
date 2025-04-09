import { PaymentProvider } from './base.provider';
import { Order } from '../types';

export class StripePaymentProvider implements PaymentProvider {
    private stripe: Stripe;
    private config: { secretKey: string; webhookSecret?: string };

    constructor(config: { secretKey: string; webhookSecret?: string }) {
        this.config = config;
        this.stripe = new Stripe(config.secretKey, { apiVersion: '2023-10-16' });
    }

    async processPayment(order: Order) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(order.totalAmount * 100),
                currency: 'usd',
                metadata: { orderId: order.id, serviceId: order.serviceId, vendorId: order.vendorId }
            });
            return { success: true, transactionId: paymentIntent.id };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    async getPaymentStatus(transactionId: string) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(transactionId);
            return { status: paymentIntent.status, details: paymentIntent };
        } catch (error) {
            return { status: 'error', details: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    async processRefund(order: Order, amount?: number) {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: order.paymentMethodId,
                amount: amount ? Math.round(amount * 100) : undefined
            });
            return { success: true, refundId: refund.id };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    getName(): string {
        return 'stripe';
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
import Stripe from 'stripe';
