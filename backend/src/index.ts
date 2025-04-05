import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

interface Order {
    id: string;
    roomNumber: string;
    customerName: string;
    paymentMethod: string;
    notes: string;
    status: string;
    createdAt: string;
    cost: number;
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory storage
let orders: Order[] = [];

// Routes
app.post('/api/order', (req: Request, res: Response) => {
    const { roomNumber, customerName, paymentMethod, notes } = req.body;
    const newOrder: Order = {
        id: Date.now().toString(),
        roomNumber,
        customerName,
        paymentMethod,
        notes,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        cost: 5.00 // Base cost per bag
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.get('/api/orders', (_req: Request, res: Response) => {
    res.json(orders);
});

app.put('/api/order/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }

    orders[orderIndex] = { ...orders[orderIndex], status };
    res.json(orders[orderIndex]);
});

// Add some dummy data
orders.push({
    id: '1',
    roomNumber: '101',
    customerName: 'John Doe',
    status: 'Washing',
    paymentMethod: 'Card',
    notes: 'Please handle with care',
    createdAt: new Date().toISOString(),
    cost: 5.00
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});