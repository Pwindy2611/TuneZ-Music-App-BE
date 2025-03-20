import dotenv from 'dotenv';

dotenv.config();

export const momoConfig = {
  partnerCode: process.env.MOMO_PARTNER_CODE || '',
  publicKey: process.env.MOMO_PUBLIC_KEY || '',
  returnUrl: process.env.MOMO_RETURN_URL || '',
  paymentUrl: process.env.MOMO_PAYMENT_URL || '',
  aesTokenUrl: process.env.MOMO_AES_TOKEN_URL || '',
  ipnUrl: process.env.MOMO_IPN_URL || '',
  disbursementUrl: process.env.MOMO_DISBURSEMENT_URL || '',
  transactionStatusUrl: process.env.MOMO_TRANSACTION_STATUS_URL || '',
  accessKey: process.env.MOMO_ACCESS_KEY || '',
  secretKey: process.env.MOMO_SECRET_KEY || '',
  storeId: process.env.MOMO_STORE_ID || '',
  storeName: process.env.MOMO_STORE_NAME || '',
  logo: process.env.MOMO_LOGO || ''
};

// Validate required environment variables
const requiredEnvVars = [
  'MOMO_PARTNER_CODE',
  'MOMO_PUBLIC_KEY',
  'MOMO_RETURN_URL',
  'MOMO_PAYMENT_URL',
  'MOMO_IPN_URL',
  'MOMO_ACCESS_KEY',
  'MOMO_SECRET_KEY',
  'MOMO_STORE_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
} 