import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import PlaylistUserService from '../service/user/PlaylistUserService.js';
import { envConfig } from '../config/EnvConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, './proto/playlist.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const playlistProto = grpc.loadPackageDefinition(packageDefinition).playlist;

async function getUserPlaylistHandler(call: any, callback: any) {
    try {
        const { userId } = call.request;
        const playlists = await PlaylistUserService.getUserPlaylists(userId);
        callback(null, { playlists });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error fetching user playlists: ${error.message}`
        });
    }
}

function startServer() {
    const server = new grpc.Server();
    server.addService((playlistProto as any).PlaylistService.service, { getUserPlaylist: getUserPlaylistHandler });

    const host = envConfig.getRpcHost();
    const port = envConfig.getRpcHostPort();
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`Playlist gRPC server running on ${host}:${port}`);
    });
}

startServer();