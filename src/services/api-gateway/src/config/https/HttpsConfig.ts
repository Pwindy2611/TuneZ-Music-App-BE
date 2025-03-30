import https from 'https';
import fs from 'fs';
import { envConfig } from '../EnvConfig.js';

const serverKeyPath = envConfig.getServerKeyPath();
const serverCertPath = envConfig.getServerCertPath();

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