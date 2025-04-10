import { PaymentProvider } from '../types';
import { StripePaymentProvider } from './stripe.provider';
import { RozoPaymentProvider } from './rozo.provider';

export class PaymentProviderFactory {
    private static providers: Map<string, PaymentProvider> = new Map();

    static initialize(config: any) {
        // Initialize Stripe provider
        const stripeProvider = new StripePaymentProvider(config.stripe);
        this.providers.set(stripeProvider.id, stripeProvider);

        // Initialize Rozo provider
        const rozoProvider = new RozoPaymentProvider(config.rozo);
        this.providers.set(rozoProvider.id, rozoProvider);
    }

    static getProvider(providerId: string): PaymentProvider | undefined {
        return this.providers.get(providerId);
    }

    static getActiveProviders(): PaymentProvider[] {
        return Array.from(this.providers.values()).filter(provider => provider.isActive);
    }

    static getAllProviders(): PaymentProvider[] {
        return Array.from(this.providers.values());
    }
}