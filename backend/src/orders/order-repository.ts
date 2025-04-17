import { Order } from '../types';
import fs from 'fs';
import path from 'path';

/**
 * A simple file-based repository for storing orders
 * In a production environment, this would be replaced with a database
 */
export class OrderRepository {
    private orders: Order[] = [];
    private readonly dataFile: string;

    constructor() {
        // Use a data directory in the project root
        const dataDir = path.join(__dirname, '../../data');

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        this.dataFile = path.join(dataDir, 'orders.json');

        // Load existing orders if the file exists
        try {
            if (fs.existsSync(this.dataFile)) {
                const data = fs.readFileSync(this.dataFile, 'utf8');
                this.orders = JSON.parse(data);
                console.log(`Loaded ${this.orders.length} orders from storage`);
            }
        } catch (error) {
            console.error('Error loading orders from file:', error);
            this.orders = [];
        }
    }

    /**
     * Save the current orders to the data file
     */
    private saveOrders(): void {
        try {
            fs.writeFileSync(this.dataFile, JSON.stringify(this.orders, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving orders to file:', error);
        }
    }

    /**
     * Create a new order
     */
    create(order: Order): Order {
        // Check if order with same ID already exists
        const existingIndex = this.orders.findIndex(o => o.id === order.id);

        if (existingIndex >= 0) {
            // Update existing order
            this.orders[existingIndex] = {
                ...this.orders[existingIndex],
                ...order,
                updatedAt: new Date()
            };
        } else {
            // Add new order
            this.orders.push(order);
        }

        this.saveOrders();
        return order;
    }

    /**
     * Find all orders
     */
    findAll(): Order[] {
        return [...this.orders].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    /**
     * Find an order by ID
     */
    findById(id: string): Order | undefined {
        return this.orders.find(order => order.id === id);
    }

    /**
     * Update an existing order
     */
    update(order: Order): Order {
        const index = this.orders.findIndex(o => o.id === order.id);

        if (index < 0) {
            throw new Error(`Order with ID ${order.id} not found`);
        }

        this.orders[index] = {
            ...this.orders[index],
            ...order,
            updatedAt: new Date()
        };

        this.saveOrders();
        return this.orders[index];
    }

    /**
     * Delete an order by ID
     */
    delete(id: string): boolean {
        const initialLength = this.orders.length;
        this.orders = this.orders.filter(order => order.id !== id);

        if (this.orders.length !== initialLength) {
            this.saveOrders();
            return true;
        }

        return false;
    }
}