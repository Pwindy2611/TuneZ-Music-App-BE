import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { envConfig } from '../config/EnvConfig.js';
import {OfficialArtistBaseService} from "../service/base/OfficialArtistBaseService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, './proto/artist.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const artistProto = grpc.loadPackageDefinition(packageDefinition).artist;

async function getAllArtistsHandler(call: any, callback: any) {
    try {
        const artists = await OfficialArtistBaseService.getAllOfficialArtists();

        const artistsWithType = artists.map((artist: any) => ({
            _id: artist.id,
            name: artist.name,
            imgPath: artist.profile.profileImage,
            type: 'Artist'
        }));
        callback(null, { artists: artistsWithType });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error fetching artists: ${error.message}`
        });
    }
}

function startServer() {
    const server = new grpc.Server();
    server.addService((artistProto as any).ArtistService.service, { getAllArtists: getAllArtistsHandler });

    const host = envConfig.getRpcHost();
    const port = envConfig.getRpcHostPort();
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`Artist gRPC server running on ${host}:${port}`);
    });
}

startServer();