import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_PROTO_PATH = path.resolve(__dirname, '../proto/user.proto');

const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});



const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;

const userServicePort = process.env.GRPC_PORT_USER_SERVICE || '50201';

export const userServiceClient = new (userProto as any).UserService(
    `user-service:${userServicePort}`,
    grpc.credentials.createInsecure()
);
