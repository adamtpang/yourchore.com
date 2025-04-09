import { Service, Order, ServiceConfig } from '../types';

export interface BaseService {
  // Service configuration
  getConfig(): ServiceConfig;

  // Order management
  createOrder(data: Partial<Order>): Promise<Order>;
  getOrder(orderId: string): Promise<Order>;
  updateOrderStatus(orderId: string, status: string): Promise<Order>;

  // Service-specific operations
  calculatePrice(data: any): Promise<number>;
  validateOrder(data: any): Promise<boolean>;

  // Service metadata
  getServiceInfo(): Service;
  isAvailable(): Promise<boolean>;
}