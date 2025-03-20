import { PaymentMethod } from '../../enum/PaymentMethodEnum.js';
import { PaymentCurrency } from '../../enum/PaymentCurrencyEnum.js';

export interface ICreatePaymentRequest {
  amount: number;
  currency: PaymentCurrency;
  paymentMethod: PaymentMethod;
  description?: string;
  metadata?: Record<string, any>;
} 