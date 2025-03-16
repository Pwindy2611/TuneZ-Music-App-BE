import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOVE_PROTO_PATH = path.resolve(__dirname, '../../grpc/proto/love.proto');
const HISTORY_PROTO_PATH = path.resolve(__dirname, '../../grpc/proto/history.proto');

const lovePackageDefinition = protoLoader.loadSync(LOVE_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const historyPackageDefinition = protoLoader.loadSync(HISTORY_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const loveProto = grpc.loadPackageDefinition(lovePackageDefinition).love;
const historyProto = grpc.loadPackageDefinition(historyPackageDefinition).history;

export const loveServiceClient = new (loveProto as any).LoveService(
    'love-service:50055',
    grpc.credentials.createInsecure()
);

export const historyServiceClient = new (historyProto as any).HistoryService(
    'history-service:50054',
    grpc.credentials.createInsecure()
);