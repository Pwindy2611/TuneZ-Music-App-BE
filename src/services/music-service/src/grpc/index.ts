import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { musicBaseRepository } from '../config/container/Container.js';
import { envConfig } from '../config/EnvConfig.js';
import {MusicBaseService} from "../service/base/MusicBaseService.js";

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

async function getAllMusicHandler(call: any, callback: any) {
    try {
        const response = await MusicBaseService.getAllMusic.execute();

        if (!response) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'No music found'
            });
            return;
        }

        const musicWithType = response.map((music: any) => ({ ...music, type: 'Song' }));

        callback(null, { music: musicWithType });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error getting all music: ${error.message}`
        });
    }
}
function startServer() {
    const server = new grpc.Server();
    server.addService((musicProto as any).MusicService.service, { incrementLoveCount: incrementLoveCountHandler, getAllMusic: getAllMusicHandler });

    const host = envConfig.getRpcHost();
    const port = envConfig.getRpcHostPort();
    
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`Music gRPC server running on ${host}:${port}`);
    });
}

startServer();