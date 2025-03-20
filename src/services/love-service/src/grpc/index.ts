import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMusicIdsByUserLove } from '../service/LoveUserService.GetMusicIdsByUserLove.js';
import dotenv from 'dotenv';

dotenv.config();

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

    const port = process.env.GRPC_PORT_LOVE_SERVICE || '50205';
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`gRPC server running on port ${port}`);
    });
}

startServer();