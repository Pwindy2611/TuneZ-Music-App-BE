import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { envConfig } from '../../config/EnvConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUBSCRIPTION_PROTO_PATH = path.resolve(__dirname, '../proto/subscription.proto');

const subscriptionPackageDefinition = protoLoader.loadSync(SUBSCRIPTION_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const subscriptionProto = grpc.loadPackageDefinition(subscriptionPackageDefinition).subscription;

const subscriptionServicePort = envConfig.getRpcSubscriptionServicePort();

export const subscriptionServiceClient = new (subscriptionProto as any).SubscriptionService(
    `subscription-service:${subscriptionServicePort}`,
    grpc.credentials.createInsecure()
);
