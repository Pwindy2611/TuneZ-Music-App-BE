import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { FollowUserService } from '../service/FollowUserService';

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

function startServer() {
    const server = new grpc.Server();
    server.addService((followProto as any).FollowService.service, { getFollowingCount: getFollowingCountHandler, getFollowerCount: getFollowerCountHandler });

    server.bindAsync('0.0.0.0:50056', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`gRPC server running on port ${port}`);
    });
}

startServer();