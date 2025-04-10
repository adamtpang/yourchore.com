import { v4 as uuidv4 } from 'uuid';
import { Order, OrderStatus, PaymentStatus } from '../types';

export class OrderService {
    private orders: Order[] = [];

    createOrder(orderData: Partial<Order>): Order {
        const order: Order = {
            id: uuidv4(),
            serviceId: 'laundry',
            vendorId: orderData.vendorId || 'angie',
            customerId: orderData.customerId || uuidv4(), // In MVP, we're not tracking customers
            status: OrderStatus.PENDING,
            items: [],
            totalAmount: orderData.totalAmount || 0,
            royaltyFee: orderData.royaltyFee || 0,
            paymentStatus: PaymentStatus.PENDING,
            paymentMethod: orderData.paymentMethod || 'stripe',
            metadata: {
                name: orderData.metadata?.name,
                roomNumber: orderData.metadata?.roomNumber,
                laundryType: orderData.metadata?.laundryType,
                ...orderData.metadata
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.orders.push(order);
        return order;
    }

    getOrders(): Order[] {
        return this.orders;
    }

    getOrderById(orderId: string): Order | undefined {
        return this.orders.find(order => order.id === orderId);
    }

    updateOrderStatus(orderId: string, status: OrderStatus): Order | undefined {
        const order = this.orders.find(order => order.id === orderId);
        if (order) {
            order.status = status;
            order.updatedAt = new Date();
        }
        return order;
    }

    updatePaymentStatus(orderId: string, status: PaymentStatus): Order | undefined {
        const order = this.orders.find(order => order.id === orderId);
        if (order) {
            order.paymentStatus = status;
            order.updatedAt = new Date();
        }
        return order;
    }
}