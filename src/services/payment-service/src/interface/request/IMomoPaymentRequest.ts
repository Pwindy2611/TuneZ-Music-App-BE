export interface IMomoPaymentRequest {
  partnerCode: string;
  orderId: string;
  orderInfo: string;
  amount: number;
  redirectUrl: string;
  ipnUrl: string;
  requestType: string;
  extraData: string;
  lang: string;
  orderGroupId?: string;
  autoCapture?: boolean;
} 