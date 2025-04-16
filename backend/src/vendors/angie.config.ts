import { Vendor, ServiceType } from '../types';

export const angieConfig: Vendor = {
  id: 'angie',
  name: "Angie's Laundry",
  description: 'Professional laundry service for Network School campus',
  isActive: true,
  services: [ServiceType.LAUNDRY],
  royaltyRate: 0.15, // 15% royalty fee
  paymentMethods: ['stripe'],
  config: {
    location: 'Network School Campus',
    operatingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' }
    }
  },
  contactInfo: {
    phone: '+1234567890',
    email: 'angie@yourchore.com'
  },
  createdAt: new Date(),
  updatedAt: new Date()
};