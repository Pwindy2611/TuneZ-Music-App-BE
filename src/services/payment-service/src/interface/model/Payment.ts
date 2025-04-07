import { PaymentMethod } from '../../enum/PaymentMethod.js';
import { PaymentStatus } from '../../enum/PaymentStatus.js';

export interface Payment {
  orderId: string;
  referenceId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
} 