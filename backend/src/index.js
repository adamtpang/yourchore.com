const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory storage
let orders = [];

// Routes
app.post('/api/order', (req, res) => {
    const { roomNumber, customerName, paymentMethod, notes } = req.body;
    const newOrder = {
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

app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.put('/api/order/:id', (req, res) => {
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