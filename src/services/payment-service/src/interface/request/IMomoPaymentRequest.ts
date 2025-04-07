export interface IMomoPaymentRequest {
  partnerCode: string;
  subPartnerCode?: string; 
  storeName?: string;
  storeId?: string; 
  requestId: string;
  amount: number;
  orderId: string;
  orderInfo: string; 
  orderGroupId?: number;
  redirectUrl: string;
  ipnUrl: string; 
  requestType: string; 
  extraData: string;
  items?: Array<any>;
  deliveryInfo?: any;
  userInfo?: any;
  referenceId?: string;
  autoCapture?: boolean;
  signature?: string
  lang: string;
} 