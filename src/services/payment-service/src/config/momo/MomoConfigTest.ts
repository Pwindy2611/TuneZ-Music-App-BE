import dotenv from 'dotenv';
import { IMomoConfigTest } from '../../interface/object/IMomoConfigTest.js';

dotenv.config();

export const momoTestConfig: IMomoConfigTest = {
  partnerCode: process.env.MOMO_TEST_PARTNER_CODE || '',
  accessKey: process.env.MOMO_TEST_ACCESS_KEY || '',
  secretKey: process.env.MOMO_TEST_SECRET_KEY || '',
  redirectUrl: process.env.MOMO_TEST_RETURN_URL || '',
  ipnUrl: process.env.MOMO_TEST_IPN_URL || '',
  paymentUrl: process.env.MOMO_TEST_PAYMENT_URL || '',
  aesTokenUrl: process.env.MOMO_TEST_AES_TOKEN_URL || '',
  disbursementUrl: process.env.MOMO_TEST_DISBURSEMENT_URL || '',
  transactionStatusUrl: process.env.MOMO_TEST_TRANSACTION_STATUS_URL || '',
  storeId: process.env.MOMO_TEST_STORE_ID || '',
  storeName: process.env.MOMO_STORE_NAME || '',
  logo: process.env.MOMO_LOGO || '',
  publicKey: process.env.MOMO_PUBLIC_KEY || ''
};

// Validate required environment variables
const requiredEnvVars = [
  'MOMO_TEST_PARTNER_CODE',
  'MOMO_TEST_ACCESS_KEY',
  'MOMO_TEST_SECRET_KEY',
  'MOMO_TEST_RETURN_URL',
  'MOMO_TEST_PAYMENT_URL',
  'MOMO_TEST_IPN_URL',
  'MOMO_TEST_STORE_ID',
  'MOMO_PUBLIC_KEY',
  'MOMO_STORE_NAME',
  'MOMO_LOGO'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
} 