import { Vendor } from '../types';

export const angieConfig: Vendor = {
  id: 'angie',
  name: "Angie's Laundry",
  description: 'Professional laundry service for Network School campus',
  isActive: true,
  services: ['laundry'],
  royaltyRate: 0.15, // 15% royalty fee
  paymentMethods: ['stripe'],
  config: {
    location: 'Network School Campus',
    operatingHours: {
      start: '08:00',
      end: '20:00'
    },
    contact: {
      phone: '+1234567890',
      email: 'angie@yourchore.com'
    }
  }
};