import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALBUM_PROTO_PATH = path.resolve(__dirname, '../proto/album.proto');

const albumPackageDefinition = protoLoader.loadSync(ALBUM_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const albumProto = grpc.loadPackageDefinition(albumPackageDefinition).album;

const albumServicePort = process.env.GRPC_PORT_ALBUM_SERVICE || '50208';

export const albumServiceClient = new (albumProto as any).AlbumService(
    `album-service:${albumServicePort}`,
    grpc.credentials.createInsecure()
);