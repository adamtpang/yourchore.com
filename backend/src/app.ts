import express from 'express';
import cors from 'cors';
import { PaymentController } from './payments/payment.controller';
import { OrderController } from './orders/order.controller';

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS to allow requests from frontend
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
});

// Initialize payment routes
const paymentController = new PaymentController();
app.use('/api/payments', paymentController.getRouter());

// Initialize order routes
const orderController = new OrderController();
app.use('/api/orders', orderController.getRouter());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;