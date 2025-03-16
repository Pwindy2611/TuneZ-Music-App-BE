import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import {musicBaseRepository} from "../config/container/Container.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, './proto/music.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const musicProto = grpc.loadPackageDefinition(packageDefinition).music;

async function incrementLoveCountHandler(call: any, callback: any) {
    try {
        const { musicId } = call.request;
        const response = await musicBaseRepository.incrementLoveCount(musicId);
        callback(null, { message: response });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error incrementing love count: ${error.message}`
        });
    }
}

function startServer() {
    const server = new grpc.Server();
    server.addService((musicProto as any).MusicService.service, { incrementLoveCount: incrementLoveCountHandler });

    server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`gRPC server running on port ${port}`);
    });
}

startServer();