import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { albumBaseService } from '../service/base/AlbumBaseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, './proto/album.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const albumProto = grpc.loadPackageDefinition(packageDefinition).album;

async function getAlbumsByArtistHandler(call: any, callback: any) {
    try {
        const albums = await albumBaseService.getAlbumsByArtistId(call.request.artistId);

        const response = {
            albums: albums.map((album) => ({
                id: call.request.artistId,
                title: album.title,
                type: album.type,
                coverImage: album.coverImage || '',
                releaseDate: album.releaseDate || new Date().toISOString()
            }))
        };
        callback(null, response);
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: error.message
        });
    }
}

function startServer() {
    const server = new grpc.Server();
    server.addService((albumProto as any).AlbumService.service, { getAlbumsByArtist: getAlbumsByArtistHandler });

    server.bindAsync('0.0.0.0:50058', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`Album gRPC server running on port ${port}`);
    });
}

startServer();