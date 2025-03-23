import crypto from 'crypto';

export class CryptoUtil {

  static generateSignature(data: string, secretKey: string): string {
    return crypto
      .createHmac('sha256', secretKey)
      .update(data)
      .digest('hex');
  }

  static generateHash(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  static generateOrderId(itemId: string, userId: string): string {
    const rawData = `${itemId}_${userId}_${Date.now()}`;
    return this.generateHash(rawData).slice(0, 24);
  }


  static generateRequestId(orderId: string): string {
    const rawData = `req_${orderId}`;
    return this.generateHash(rawData).slice(0, 24); 
  }
} 