import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import {subscriptionBaseService} from '../service/base/SubscriptionBaseService.js';
import {subscriptionUserService} from "../service/user/SubscriptionUserService.js";
import { envConfig } from '../config/EnvConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, './proto/subscription.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const subscriptionProto = grpc.loadPackageDefinition(packageDefinition).subscription;

async function isSubscriptionHandler(call: any, callback: any) {
    try {
        const { id } = call.request;
        const isSubscribed = await subscriptionBaseService.isSubscription(id);
        callback(null, { isSubscribed });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error fetching subscription: ${error.message}`
        });
    }
}

async function subscribeHandler(call: any, callback: any) {
    try {
        const { userId, subscriptionId } = call.request;
        await subscriptionUserService.subscribeToSubscription(userId, subscriptionId);
        callback(null, { success: true });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error subscribing: ${error.message}`
        });
    }
}

function startServer() {
    const server = new grpc.Server();
    server.addService((subscriptionProto as any).SubscriptionService.service, { isSubscription: isSubscriptionHandler, subscribe: subscribeHandler });

    const host = envConfig.getRpcHost();
    const port = envConfig.getRpcHostPort();
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`Subscription gRPC server running on ${host}:${port}`);
    });
}

startServer();