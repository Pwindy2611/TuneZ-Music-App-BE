import { IPaymentService } from '../interface/service/IPaymentService.js';
import { MomoService } from './MomoService.js';
import { PaymentMethod } from '../enum/PaymentMethod.js';

export class PaymentServiceFactory {
  static createPaymentService(paymentMethod: PaymentMethod): IPaymentService {
    switch (paymentMethod) {
      case PaymentMethod.MOMO:
        return new MomoService();
      case PaymentMethod.ZALOPAY:
        // TODO: Implement ZaloPay service
        throw new Error('ZaloPay payment method is not implemented yet');
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
  }
} 