import { PaymentMethod } from '../../enum/PaymentMethod.js';
import { PaymentStatus } from '../../enum/PaymentStatus.js';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
} 