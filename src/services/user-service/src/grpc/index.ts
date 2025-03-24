import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import {UserService} from '../service/user/UserService.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, './proto/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

async function updateSubscriptionTypeHandler(call: any, callback: any) {
    try {
        const { userId } = call.request;
        const success = await UserService.updateSubscriptionType.execute(userId);
        callback(null, { success });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error update subscription status: ${error.message}`
        });
    }
}

function startServer() {
    const server = new grpc.Server();
    server.addService((userProto as any).UserSerivce.service, {updateSubscriptionType: updateSubscriptionTypeHandler });

    const host = process.env.GRPC_HOST || '0.0.0.0';
    const port = process.env.GRPC_PORT_SUBSCRIPTION_SERVICE || '50201';
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`User gRPC server running on ${host}:${port}`);
    });
}

startServer();