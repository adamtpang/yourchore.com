import { Order, OrderStatus } from '../types';
import { OrderRepository } from './order-repository';

export class OrderService {
    private orderRepository: OrderRepository;

    constructor() {
        this.orderRepository = new OrderRepository();
    }

    createOrder(orderData: Partial<Order>): Order {
        // Validate required fields
        if (!orderData.totalAmount && orderData.totalAmount !== 0) {
            throw new Error('Total amount is required');
        }

        // Create a new order with defaults for missing fields
        const order: Order = {
            id: orderData.id || `order_${Date.now()}`,
            totalAmount: orderData.totalAmount,
            royaltyFee: orderData.royaltyFee || orderData.totalAmount * 0.1,
            status: orderData.status || OrderStatus.PENDING,
            time: orderData.time || new Date().toISOString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: orderData.name || 'Unknown',
            room: orderData.room || 'Unknown',
            service: orderData.service || 'Laundry Service',
            amountPaid: orderData.amountPaid || orderData.totalAmount,
            tipAmount: orderData.tipAmount || 0,
            paymentMethod: orderData.paymentMethod || 'cash',
            metadata: orderData.metadata || {}
        };

        return this.orderRepository.create(order);
    }

    getOrders(): Order[] {
        return this.orderRepository.findAll();
    }

    getOrderById(id: string): Order | undefined {
        return this.orderRepository.findById(id);
    }

    updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
        const order = this.orderRepository.findById(id);
        if (!order) {
            return undefined;
        }

        order.status = status;
        order.updatedAt = new Date();

        return this.orderRepository.update(order);
    }
}