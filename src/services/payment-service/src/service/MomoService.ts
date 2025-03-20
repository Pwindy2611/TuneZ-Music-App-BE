import axios from 'axios';
import crypto from 'crypto';
import { momoConfig } from '../config/momo/MomoConfig.js';
import { IMomoPaymentRequest } from '../interface/request/IMomoPaymentRequest.js';
import { IMomoPaymentResponse } from '../interface/response/IMomoPaymentResponse.js';
import { IMomoIPNResponse } from '../interface/response/IMomoIPNResponse.js';
import { IPaymentService } from '../interface/service/IPaymentService.js';
import { ICreatePaymentRequest } from '../interface/request/ICreatePaymentRequest.js';
import { IUpdatePaymentStatusRequest } from '../interface/request/IUpdatePaymentStatusRequest.js';
import { IPaymentResponse } from '../interface/response/IPaymentResponse.js';
import { IPaymentFilters } from '../interface/object/IPaymentFilters.js';
import { PaymentStatus } from '../enum/PaymentStatus.js';
import { PaymentMethod } from '../enum/PaymentMethod.js';
import { PaymentCurrency } from '../enum/PaymentCurrency.js';
import { PaymentRepository } from '../repository/PaymentRepository.js';

export class MomoService implements IPaymentService {
  private readonly MOMO_API_URL: string;

  constructor() {
    this.MOMO_API_URL = momoConfig.paymentUrl;
  }

  private generateSignature(data: string): string {
    return crypto
      .createHmac('sha256', momoConfig.secretKey)
      .update(data)
      .digest('hex');
  }

  async createPayment(data: ICreatePaymentRequest): Promise<IPaymentResponse> {
    const request: IMomoPaymentRequest = {
      partnerCode: momoConfig.partnerCode,
      orderId: data.orderId,
      orderInfo: data.orderInfo || '',
      amount: data.amount,
      redirectUrl: momoConfig.returnUrl,
      ipnUrl: momoConfig.ipnUrl,
      requestType: 'captureWallet',
      extraData: data.extraData || '',
      lang: 'vi',
      autoCapture: true
    };

    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${data.amount}&extraData=${request.extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${data.orderId}&orderInfo=${request.orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.returnUrl}&requestId=${data.orderId}&requestType=${request.requestType}`;
    const signature = this.generateSignature(rawSignature);

    try {
      const response = await axios.post<IMomoPaymentResponse>(this.MOMO_API_URL, request, {
        headers: {
          'Content-Type': 'application/json',
          'X-Partner-Signature': signature
        }
      });

      const paymentResponse = this.mapToPaymentResponse(response.data);
      
      // Lưu vào Firestore
      await PaymentRepository.create({
        id: paymentResponse.id,
        orderId: data.orderId,
        amount: paymentResponse.amount,
        method: PaymentMethod.MOMO,
        status: PaymentStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return paymentResponse;
    } catch (error) {
      throw new Error(`Failed to create Momo payment: ${error.message}`);
    }
  }

  async getPayment(paymentId: string): Promise<IPaymentResponse> {
    const payment = await PaymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return this.mapToPaymentResponse(payment);
  }

  async updatePaymentStatus(
    paymentId: string,
    data: IUpdatePaymentStatusRequest
  ): Promise<IPaymentResponse> {
    const payment = await PaymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    await PaymentRepository.updateStatus(paymentId, data.status);
    return this.mapToPaymentResponse({
      ...payment,
      status: data.status,
      updatedAt: new Date()
    });
  }

  async cancelPayment(paymentId: string): Promise<IPaymentResponse> {
    const payment = await PaymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    await PaymentRepository.updateStatus(paymentId, PaymentStatus.CANCELLED);
    return this.mapToPaymentResponse({
      ...payment,
      status: PaymentStatus.CANCELLED,
      updatedAt: new Date()
    });
  }

  async refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<IPaymentResponse> {
    const payment = await PaymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    await PaymentRepository.updateStatus(paymentId, PaymentStatus.REFUNDED);
    return this.mapToPaymentResponse({
      ...payment,
      status: PaymentStatus.REFUNDED,
      updatedAt: new Date()
    });
  }

  async listPayments(
    filters?: IPaymentFilters,
    page?: number,
    limit?: number
  ): Promise<{
    items: IPaymentResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await PaymentRepository.list(filters, page, limit);
    return {
      ...result,
      items: result.items.map(payment => this.mapToPaymentResponse(payment))
    };
  }

  async verifyPaymentCallback(
    paymentId: string,
    callbackData: Record<string, any>
  ): Promise<IPaymentResponse> {
    const ipnResponse = callbackData as IMomoIPNResponse;
    const isValid = this.verifyIPN(ipnResponse);

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    const paymentResponse = this.mapToPaymentResponse(ipnResponse);
    
    // Cập nhật trạng thái trong Firestore
    await PaymentRepository.updateStatus(paymentId, paymentResponse.status);

    return paymentResponse;
  }

  private verifyIPN(ipnResponse: IMomoIPNResponse): boolean {
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${ipnResponse.amount}&extraData=${ipnResponse.extraData}&message=${ipnResponse.message}&orderId=${ipnResponse.orderId}&orderInfo=${ipnResponse.orderInfo}&orderType=${ipnResponse.orderType}&partnerCode=${ipnResponse.partnerCode}&payType=${ipnResponse.payType}&requestId=${ipnResponse.requestId}&responseTime=${ipnResponse.responseTime}&resultCode=${ipnResponse.resultCode}&transId=${ipnResponse.transId}`;
    const signature = this.generateSignature(rawSignature);
    
    return signature === ipnResponse.signature;
  }

  private mapToPaymentResponse(data: any): IPaymentResponse {
    const now = new Date();
    return {
      id: data.id || data.orderId,
      amount: data.amount,
      currency: PaymentCurrency.VND,
      status: data.status || (data.resultCode === 0 ? PaymentStatus.SUCCESS : PaymentStatus.FAILED),
      paymentMethod: PaymentMethod.MOMO,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
      metadata: {
        ...data,
        paymentUrl: 'payUrl' in data ? data.payUrl : undefined,
        deeplink: 'deeplink' in data ? data.deeplink : undefined,
        qrCodeUrl: 'qrCodeUrl' in data ? data.qrCodeUrl : undefined
      }
    };
  }
} 