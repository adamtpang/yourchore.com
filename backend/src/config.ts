import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
    PORT: z.string().transform(Number).default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    ALLOWED_ORIGINS: z.string().transform(str => str.split(',')),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

export const config = {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    allowedOrigins: env.ALLOWED_ORIGINS,
    stripe: {
        secretKey: env.STRIPE_SECRET_KEY,
        webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    },
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
} as const;

export default config;