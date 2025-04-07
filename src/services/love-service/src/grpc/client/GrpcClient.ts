import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { envConfig } from '../../config/EnvConfig.js';

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

const musicServicePort = envConfig.getRpcMusicServicePort();

export const musicServiceClient = new (musicProto as any).MusicService(
    `music-service:${musicServicePort}`,
    grpc.credentials.createInsecure()
);