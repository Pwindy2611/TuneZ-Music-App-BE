// src/services/love-service/src/grpc/server.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { getMusicIdsByUserLove } from '../service/LoveUserService.GetMusicIdsByUserLove';

const PROTO_PATH = path.resolve(__dirname, './proto/love.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const loveProto = grpc.loadPackageDefinition(packageDefinition).love;

async function getMusicIds(call: any, callback: any) {
    try {
        const { userId, limit } = call.request;
        const musicIds = await getMusicIdsByUserLove(userId, limit);
        callback(null, { musicIds });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error fetching music IDs: ${error.message}`
        });
    }
}

function startServer() {
    const server = new grpc.Server();
    server.addService((loveProto as any).LoveService.service, { getMusicIds });

    server.bindAsync('0.0.0.0:50055', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`gRPC server running on port ${port}`);
    });
}

startServer();