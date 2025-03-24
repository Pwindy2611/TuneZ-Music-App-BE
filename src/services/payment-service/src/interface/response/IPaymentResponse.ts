import { PaymentMethod } from '../../enum/PaymentMethod.js';
import { PaymentStatus } from '../../enum/PaymentStatus.js';
import { PaymentCurrency } from '../../enum/PaymentCurrency.js';

export interface IPaymentResponse {
  id: string;
  itemId: string;
  userId: string;
  amount: number;
  currency: PaymentCurrency;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
} 