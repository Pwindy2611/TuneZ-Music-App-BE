import { PaymentMethod } from '../../enum/PaymentMethod.js';
import { PaymentCurrency } from '../../enum/PaymentCurrency.js';

export interface ICreatePaymentRequest {
  orderId: string;
  amount: number;
  currency: PaymentCurrency;
  paymentMethod: PaymentMethod;
  orderInfo?: string;
  extraData?: string;
  description?: string;
  metadata?: Record<string, any>;
} 