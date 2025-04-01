import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { envConfig } from '../../config/EnvConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MUSIC_PROTO_PATH = path.resolve(__dirname, '../proto/music.proto');
const PLAYLIST_PROTO_PATH = path.resolve(__dirname, '../proto/playlist.proto');
const ARTIST_PROTO_PATH = path.resolve(__dirname, '../proto/artist.proto');

const musicPackageDefinition = protoLoader.loadSync(MUSIC_PROTO_PATH, {
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

const artistPackageDefinition = protoLoader.loadSync(ARTIST_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const musicProto = grpc.loadPackageDefinition(musicPackageDefinition).music;
const playlistProto = grpc.loadPackageDefinition(playlistPackageDefinition).playlist;
const artistProto = grpc.loadPackageDefinition(artistPackageDefinition).artist;

const musicServicePort = envConfig.getRpcMusicServicePort();
const playlistServicePort = envConfig.getRpcPlaylistServicePort();
const artistServicePort = envConfig.getRpcArtistServicePort();

export const musicServiceClient = new (musicProto as any).MusicService(
    `music-service:${musicServicePort}`,
    grpc.credentials.createInsecure()
);

export const playlistServiceClient = new (playlistProto as any).PlaylistService(
    `playlist-service:${playlistServicePort}`,
    grpc.credentials.createInsecure()
);

export const artistServiceClient = new (artistProto as any).ArtistService(
    `official-artist-service:${artistServicePort}`,
    grpc.credentials.createInsecure()
)