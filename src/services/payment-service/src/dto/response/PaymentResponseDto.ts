import { PaymentMethod } from '../../enum/PaymentMethod.js';
import { PaymentStatus } from '../../enum/PaymentStatus.js';
import { PaymentCurrency } from '../../enum/PaymentCurrency.js';
import { IPaymentResponse } from '../../interface/response/IPaymentResponse.js';

export class PaymentResponseDto implements IPaymentResponse {
  id: string;
  itemId: string;
  userId: string;
  amount: number;
  currency: PaymentCurrency;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IPaymentResponse) {
    this.id = data.id;
    this.itemId = data.itemId;
    this.userId = data.userId;
    this.amount = data.amount;
    this.currency = data.currency;
    this.paymentMethod = data.paymentMethod;
    this.status = data.status;
    this.metadata = data.metadata;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
} 