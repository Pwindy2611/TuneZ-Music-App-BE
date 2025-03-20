import { PaymentMethod } from '../../enum/PaymentMethodEnum.js';
import { PaymentStatus } from '../../enum/PaymentStatusEnum.js';
import { PaymentCurrency } from '../../enum/PaymentCurrencyEnum.js';

export interface IPaymentResponse {
  id: string;
  amount: number;
  currency: PaymentCurrency;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
} 