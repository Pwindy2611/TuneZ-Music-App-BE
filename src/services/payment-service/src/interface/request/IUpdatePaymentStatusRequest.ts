import { PaymentStatus } from '../../enum/PaymentStatusEnum.js';

export interface IUpdatePaymentStatusRequest {
  status: PaymentStatus;
  metadata?: Record<string, any>;
} 