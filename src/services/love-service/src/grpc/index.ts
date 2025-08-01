import { getMusicIdsByUserLove } from '../service/user/LoveUserService.GetMusicIdsByUserLove.js';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { envConfig } from '../config/EnvConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    const host = envConfig.getRpcHost();
    const port = envConfig.getRpcHostPort();
    
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`Love gRPC server running on ${host}:${port}`);
    });
}

startServer();