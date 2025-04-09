import Stripe from 'stripe';
import { PaymentProvider } from './base.provider';
import { Order } from '../types';

export class StripePaymentProvider implements PaymentProvider {
    private stripe: Stripe;
    public id = 'stripe';
    public name = 'Stripe';
    public isActive = true;
    public config: any;

    constructor(config: { secretKey: string; webhookSecret?: string }) {
        this.config = config;
        this.stripe = new Stripe(config.secretKey, { apiVersion: '2025-03-31.basil' });
    }

    async processPayment(order: Order): Promise<{
        success: boolean;
        transactionId?: string;
        error?: string;
    }> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(order.totalAmount * 100),
                currency: 'usd',
                metadata: { orderId: order.id, serviceId: order.serviceId, vendorId: order.vendorId }
            });
            return { success: true, transactionId: paymentIntent.id };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async getPaymentStatus(transactionId: string): Promise<{
        status: string;
        details?: any;
    }> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(transactionId);
            return { status: paymentIntent.status, details: paymentIntent };
        } catch (error) {
            return {
                status: 'error',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async processRefund(order: Order, amount?: number): Promise<{
        success: boolean;
        refundId?: string;
        error?: string;
    }> {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: order.paymentMethodId,
                amount: amount ? Math.round(amount * 100) : undefined
            });
            return { success: true, refundId: refund.id };
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
