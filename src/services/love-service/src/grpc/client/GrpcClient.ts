import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MUSIC_PROTO_PATH = path.resolve(__dirname, '../proto/music.proto');

const musicPackageDefinition = protoLoader.loadSync(MUSIC_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const musicProto = grpc.loadPackageDefinition(musicPackageDefinition).music;

const musicServicePort = process.env.GRPC_PORT_MUSIC_SERVICE || '50203';

export const musicServiceClient = new (musicProto as any).MusicService(
    `music-service:${musicServicePort}`,
    grpc.credentials.createInsecure()
);