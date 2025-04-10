import { Router, Request, Response } from 'express';
import { PaymentService } from './payment.service';

export class PaymentController {
    private router: Router;
    private paymentService: PaymentService;

    constructor() {
        this.router = Router();
        this.paymentService = new PaymentService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/process', this.processPayment.bind(this));
        this.router.get('/status/:providerId/:paymentId', this.getPaymentStatus.bind(this));
        this.router.post('/refund', this.processRefund.bind(this));
        this.router.get('/providers', this.getProviders.bind(this));
        this.router.get('/providers/active', this.getActiveProviders.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    private async processPayment(req: Request, res: Response) {
        try {
            const { providerId, amount, currency, metadata } = req.body;
            if (!providerId || !amount || !currency) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const result = await this.paymentService.processPayment(providerId, amount, currency, metadata);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    private async getPaymentStatus(req: Request, res: Response) {
        try {
            const { providerId, paymentId } = req.params;
            const status = await this.paymentService.getPaymentStatus(providerId, paymentId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    private async processRefund(req: Request, res: Response) {
        try {
            const { providerId, paymentId, amount, reason } = req.body;
            if (!providerId || !paymentId || !amount) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const result = await this.paymentService.processRefund(providerId, paymentId, amount, reason);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    private getProviders(_req: Request, res: Response) {
        try {
            const providers = this.paymentService.getAllProviders();
            res.json(providers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    private getActiveProviders(_req: Request, res: Response) {
        try {
            const providers = this.paymentService.getActiveProviders();
            res.json(providers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}