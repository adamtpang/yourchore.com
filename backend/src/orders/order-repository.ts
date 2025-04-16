import fs from 'fs';
import path from 'path';

// Define the order structure for our simple MVP
export interface ChoreOrder {
    id: string;
    name: string;
    room: string;
    service: string;
    time: string;
    amountPaid: number;
    royalty: number;
    status: 'Pending' | 'Picked Up' | 'Delivered';
    paymentMethod: string;
    metadata?: Record<string, any>;
}

class OrderRepository {
    private orders: ChoreOrder[] = [];
    private readonly filePath: string;

    constructor() {
        this.filePath = path.join(__dirname, '../../../data/orders.json');
        this.loadOrders();
    }

    private loadOrders(): void {
        try {
            // Ensure directory exists
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Load existing orders if file exists
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                this.orders = JSON.parse(data);
                // Migrate any old status values
                this.orders = this.orders.map(order => {
                    // Handle legacy status values
                    if (order.status === 'In Progress') {
                        return { ...order, status: 'Picked Up' };
                    }
                    if (order.status === 'Completed') {
                        return { ...order, status: 'Delivered' };
                    }
                    return order;
                });
            } else {
                // Create empty file if it doesn't exist
                fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            // Initialize with empty array if loading fails
            this.orders = [];
        }
    }

    private saveOrders(): void {
        try {
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.filePath, JSON.stringify(this.orders, null, 2));
        } catch (error) {
            console.error('Error saving orders:', error);
        }
    }

    public getOrders(): ChoreOrder[] {
        return this.orders;
    }

    public getOrderById(id: string): ChoreOrder | undefined {
        return this.orders.find(order => order.id === id);
    }

    public addOrder(order: ChoreOrder): ChoreOrder {
        this.orders.push(order);
        this.saveOrders();
        return order;
    }

    public updateOrderStatus(id: string, status: ChoreOrder['status']): ChoreOrder | null {
        const orderIndex = this.orders.findIndex(order => order.id === id);
        if (orderIndex === -1) return null;

        this.orders[orderIndex].status = status;
        this.saveOrders();
        return this.orders[orderIndex];
    }
}

// Singleton instance
export const orderRepository = new OrderRepository();