import { IPaymentResponse } from '../response/IPaymentResponse.js';
import { ICreatePaymentRequest } from '../request/ICreatePaymentRequest.js';
import { IUpdatePaymentStatusRequest } from '../request/IUpdatePaymentStatusRequest.js';
import { IPaymentFilters } from '../object/IPaymentFilters.js';

export interface IPaymentService {
  createPayment(data: ICreatePaymentRequest): Promise<IPaymentResponse>;

  getPayment(paymentId: string): Promise<IPaymentResponse>;

  updatePaymentStatus(
    paymentId: string, 
    data: IUpdatePaymentStatusRequest
  ): Promise<IPaymentResponse>;

  cancelPayment(paymentId: string): Promise<IPaymentResponse>;

  refundPayment(
    paymentId: string, 
    amount?: number
  ): Promise<IPaymentResponse>;

  listPayments(
    filters?: IPaymentFilters,
    page?: number,
    limit?: number
  ): Promise<{
    items: IPaymentResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Xác thực payment callback từ cổng thanh toán
   */
  verifyPaymentCallback(
    callbackData: Record<string, any>
  ): Promise<IPaymentResponse>;
} 