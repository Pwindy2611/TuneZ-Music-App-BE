import axios from 'axios';
import { momoTestConfig } from '../config/momo/MomoConfigTest.js';
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
import { CryptoUtil } from '../util/CryptoUtil.js';

export class MomoService implements IPaymentService {
  private readonly MOMO_API_URL: string;

  constructor() {
    this.MOMO_API_URL = momoTestConfig.paymentUrl;
  }

  async createPayment(data: ICreatePaymentRequest): Promise<IPaymentResponse> {
    try {
      const requestId = CryptoUtil.generateRequestId(data.orderId);
      const orderInfo = data.orderInfo || '';
      const extraData = data.extraData || '';

      const rawSignature = `accessKey=${momoTestConfig.accessKey}&amount=${data.amount}&extraData=${extraData}&ipnUrl=${momoTestConfig.ipnUrl}&orderId=${data.orderId}&orderInfo=${orderInfo}&partnerCode=${momoTestConfig.partnerCode}&redirectUrl=${momoTestConfig.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
      const signature = CryptoUtil.generateSignature(rawSignature, momoTestConfig.secretKey);

      const request: IMomoPaymentRequest = {
        partnerCode: momoTestConfig.partnerCode,
        orderId: data.orderId,
        orderInfo,
        amount: data.amount,
        redirectUrl: momoTestConfig.redirectUrl,
        ipnUrl: momoTestConfig.ipnUrl,
        requestType: 'captureWallet',
        extraData,
        lang: 'vi',
        referenceId: data.referenceId,
        autoCapture: true,
        requestId,
        signature,
      };

      const response = await axios.post<IMomoPaymentResponse>(this.MOMO_API_URL, request, {
        headers: {
          'Content-Type': 'application/json',
          'X-Partner-Id': momoTestConfig.partnerCode
        },
        timeout: 30000
      });

      console.log('Momo Response:', JSON.stringify(response.data, null, 2));
      
      const paymentResponse = this.mapToPaymentResponse(response.data);
      
      await PaymentRepository.create({
        orderId: data.orderId,
        referenceId: data.referenceId || "",
        amount: paymentResponse.amount,
        method: PaymentMethod.MOMO,
        status: PaymentStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return paymentResponse;
    } catch (error) {
      if (error.response) {
        console.error('Momo Error Response:', JSON.stringify(error.response.data, null, 2));
        throw new Error(`Momo API Error: ${error.response.data.message || error.message}`);
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
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

  private mapMomoResultCodeToStatus(resultCode: number): PaymentStatus {
    switch (resultCode) {
      case 0:
        return PaymentStatus.SUCCESS;
      case 1000:
        return PaymentStatus.PENDING;
      case 1006:
        return PaymentStatus.CANCELLED;
      case 1002:
        return PaymentStatus.TIMEOUT;
      default:
        return PaymentStatus.FAILED;
    }
  }
  private verifyIPN(ipnResponse: IMomoIPNResponse): boolean {
    try {
      const rawSignature = [
        `accessKey=${momoTestConfig.accessKey}`,
        `amount=${ipnResponse.amount}`,
        `extraData=${ipnResponse.extraData}`,
        `message=${ipnResponse.message}`,
        `orderId=${ipnResponse.orderId}`,
        `orderInfo=${ipnResponse.orderInfo}`,
        `orderType=${ipnResponse.orderType}`,
        `partnerCode=${ipnResponse.partnerCode}`,
        `payType=${ipnResponse.payType}`,
        `requestId=${ipnResponse.requestId}`,
        `responseTime=${ipnResponse.responseTime}`,
        `resultCode=${ipnResponse.resultCode}`,
        `transId=${ipnResponse.transId}`
      ].join('&');

      const signature = CryptoUtil.generateSignature(rawSignature, momoTestConfig.secretKey);
      return signature === ipnResponse.signature;
    } catch (error) {
      console.error('Verify IPN Error:', error);
      return false;
    }
  }

  async verifyPaymentCallback(
    itemId: string,
    userId: string,
    callbackData: Record<string, any>
  ): Promise<IPaymentResponse> {
    try {
      console.log('Momo Callback Data:', JSON.stringify(callbackData, null, 2));

      const ipnResponse = callbackData as IMomoIPNResponse;
      const isValid = this.verifyIPN(ipnResponse);

      if (!isValid) {
        console.error('Invalid signature from Momo');
        return Promise.reject(new Error('Invalid signature'));
      }

      console.log('Momo IPN Response:', JSON.stringify(ipnResponse, null, 2));

      const status = this.mapMomoResultCodeToStatus(ipnResponse.resultCode);
      const paymentResponse = this.mapToPaymentResponse({
        ...ipnResponse,
        itemId,
        userId,
        status,
        transId: ipnResponse.transId,

      });
      
      await PaymentRepository.updateStatus(ipnResponse.orderId, status);

      return paymentResponse;
    } catch (error) {
      console.error('Verify Payment Callback Error:', error);
      throw new Error(`Failed to verify payment callback: ${error.message}`);
    }
  }

  private mapToPaymentResponse(data: any): IPaymentResponse {
    const now = new Date();
    return {
      id: data.orderId,
      amount: data.amount,
      currency: PaymentCurrency.VND,
      status: data.status || (data.resultCode === 0 ? PaymentStatus.SUCCESS : PaymentStatus.FAILED),
      paymentMethod: PaymentMethod.MOMO,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
      metadata: {
        ...data,
        payUrl: 'payUrl' in data ? data.payUrl : undefined,
        deeplink: 'deeplink' in data ? data.deeplink : undefined,
        qrCodeUrl: 'qrCodeUrl' in data ? data.qrCodeUrl : undefined,
        transId: data.transId,
        message: data.message,
        payType: data.payType
      }
    };
  }
} 