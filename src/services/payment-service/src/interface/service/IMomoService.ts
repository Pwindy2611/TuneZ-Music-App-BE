import { IMomoPaymentResponse } from '../response/IMomoPaymentResponse.js';
import { IMomoIPNResponse } from '../response/IMomoIPNResponse.js';

export interface IMomoService {
  createPayment(orderId: string, amount: number, orderInfo: string): Promise<IMomoPaymentResponse>;
  verifyIPN(ipnResponse: IMomoIPNResponse): boolean;
} 