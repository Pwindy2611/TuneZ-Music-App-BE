import { PaymentMethod } from '../../enum/PaymentMethodEnum.js';
import { PaymentStatus } from '../../enum/PaymentStatusEnum.js';
import { PaymentCurrency } from '../../enum/PaymentCurrencyEnum.js';
import { IPaymentResponse } from '../../interface/response/IPaymentResponse.js';

export class PaymentResponseDto implements IPaymentResponse {
  id: string;
  amount: number;
  currency: PaymentCurrency;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IPaymentResponse) {
    this.id = data.id;
    this.amount = data.amount;
    this.currency = data.currency;
    this.paymentMethod = data.paymentMethod;
    this.status = data.status;
    this.description = data.description;
    this.metadata = data.metadata;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
} 