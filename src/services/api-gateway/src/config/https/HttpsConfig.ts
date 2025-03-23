import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const serverKeyPath = process.env.SERVER_KEY_PATH || path.join(process.cwd(), 'localhost-key.pem');
const serverCertPath = process.env.SERVER_CERT_PATH || path.join(process.cwd(), 'localhost.pem');

export const httpsOptions = {
  key: fs.readFileSync(serverKeyPath),
  cert: fs.readFileSync(serverCertPath),
  rejectUnauthorized: false,
  minVersion: 'TLSv1.2' as const,
  ciphers: [
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-ECDSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES256-GCM-SHA384'
  ].join(':')
};

export const createHttpsServer = (app: any) => {
  return https.createServer(httpsOptions, app);
}; 