import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { envConfig } from '../../config/EnvConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FOLLOW_PROTO_PATH = path.resolve(__dirname, '../proto/follow.proto');
const PLAYLIST_PROTO_PATH = path.resolve(__dirname, '../proto/playlist.proto');

const followPackageDefinition = protoLoader.loadSync(FOLLOW_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const playlistPackageDefinition = protoLoader.loadSync(PLAYLIST_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const followProto = grpc.loadPackageDefinition(followPackageDefinition).follow;
const playlistProto = grpc.loadPackageDefinition(playlistPackageDefinition).playlist;

const followServicePort = envConfig.getRpcFollowServicePort();
const playlistServicePort = envConfig.getRpcPlaylistServicePort();

export const followServiceClient = new (followProto as any).FollowService(
    `follow-service:${followServicePort}`,
    grpc.credentials.createInsecure()
);

export const playlistServiceClient = new (playlistProto as any).PlaylistService(
    `playlist-service:${playlistServicePort}`,
    grpc.credentials.createInsecure()
);