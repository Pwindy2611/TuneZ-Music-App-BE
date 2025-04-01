  import { PaymentStatus } from '../../enum/PaymentStatus.js';

export interface IUpdatePaymentStatusRequest {
  status: PaymentStatus;
  metadata?: Record<string, any>;
} 