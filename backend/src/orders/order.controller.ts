import { Router, Request, Response } from 'express';
import { OrderService } from './order.service';
import { OrderStatus } from '../types';

export class OrderController {
    private router: Router;
    private orderService: OrderService;

    constructor() {
        this.router = Router();
        this.orderService = new OrderService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/', this.createOrder.bind(this));
        this.router.get('/', this.getOrders.bind(this));
        this.router.get('/:id', this.getOrderById.bind(this));
        this.router.put('/:id/status', this.updateOrderStatus.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    private async createOrder(req: Request, res: Response) {
        try {
            const {
                name,
                roomNumber,
                laundryType,
                paymentMethod,
                basePrice,
                royaltyFee
            } = req.body;

            const order = this.orderService.createOrder({
                totalAmount: basePrice,
                royaltyFee,
                paymentMethod,
                metadata: {
                    name,
                    roomNumber,
                    laundryType
                }
            });

            res.status(201).json(order);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
        }
    }

    private async getOrders(_req: Request, res: Response) {
        try {
            const orders = this.orderService.getOrders();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
        }
    }

    private async getOrderById(req: Request, res: Response) {
        try {
            const order = this.orderService.getOrderById(req.params.id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
        }
    }

    private async updateOrderStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            if (!Object.values(OrderStatus).includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            const order = this.orderService.updateOrderStatus(req.params.id, status);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.json(order);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
        }
    }
}