import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { FollowUserService } from '../service/FollowUserService';
import dotenv from 'dotenv';

dotenv.config();

const PROTO_PATH = path.resolve(__dirname, './proto/follow.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const followProto = grpc.loadPackageDefinition(packageDefinition).follow;

async function getFollowingCountHandler(call: any, callback: any) {
    try {
        const { userId } = call.request;
        const count = await FollowUserService.getFollowingCount(userId);
        callback(null, { count });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error fetching following count: ${error.message}`
        });
    }
}

async function getFollowerCountHandler(call: any, callback: any) {
    try {
        const { userId } = call.request;
        const count = await FollowUserService.getFollowerCount(userId);
        callback(null, { count });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error fetching follower count: ${error.message}`
        });
    }
}

async function getFollowingHandler(call: any, callback: any) {
    try {
        const { userId } = call.request;
        const following = await FollowUserService.getFollowingUsers(userId);
        callback(null, { following });
    }catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error fetching following: ${error.message}`
        });
    }
}
function startServer() {
    const server = new grpc.Server();
    server.addService((followProto as any).FollowService.service, {
        getFollowingCount: getFollowingCountHandler,
        getFollowerCount: getFollowerCountHandler,
        getFollowing: getFollowingHandler
    });

    const host = process.env.GRPC_HOST || '0.0.0.0';
    const port = process.env.GRPC_PORT_FOLLOW_SERVICE || '50206';
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`Follow gRPC server running on ${host}:${port}`);
    });
}

startServer();