import { envConfig } from '../EnvConfig.js';

export const momoConfig = {
  partnerCode: envConfig.getMomoConfig().partnerCode,
  publicKey: envConfig.getMomoConfig().publicKey,
  returnUrl: envConfig.getMomoConfig().returnUrl,
  paymentUrl: envConfig.getMomoConfig().paymentUrl,
  aesTokenUrl: envConfig.getMomoConfig().aesTokenUrl,
  ipnUrl: envConfig.getMomoConfig().ipnUrl,
  disbursementUrl: envConfig.getMomoConfig().disbursementUrl,
  transactionStatusUrl: envConfig.getMomoConfig().transactionStatusUrl,
  accessKey: envConfig.getMomoConfig().accessKey,
  secretKey: envConfig.getMomoConfig().secretKey,
  storeId: envConfig.getMomoConfig().storeId,
  storeName: envConfig.getMomoConfig().storeName,
  logo: envConfig.getMomoConfig().logo
};

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