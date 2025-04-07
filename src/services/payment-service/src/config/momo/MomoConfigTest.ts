import { IMomoConfigTest } from '../../interface/object/IMomoConfigTest.js';
import { envConfig } from '../EnvConfig.js';

const config = envConfig.getMomoTestConfig();

export const momoTestConfig: IMomoConfigTest = {
  partnerCode: config.partnerCode,
  accessKey: config.accessKey,
  secretKey: config.secretKey,
  redirectUrl: config.redirectUrl,
  ipnUrl: config.ipnUrl,
  paymentUrl: config.paymentUrl,
  aesTokenUrl: config.aesTokenUrl || '',
  disbursementUrl: config.disbursementUrl || '',
  transactionStatusUrl: config.transactionStatusUrl || '',
  storeId: config.storeId,
  storeName: config.storeName,
  logo: config.logo,
  publicKey: config.publicKey
};

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