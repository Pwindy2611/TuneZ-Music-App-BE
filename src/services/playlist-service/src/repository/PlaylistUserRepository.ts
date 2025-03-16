import {IPlaylistUserRepository} from "../interface/repository/IPlaylistUserRepository.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import {IUserPlaylist} from "../interface/object/IUserPlaylist.js";
import * as dotenv from "dotenv";
import {IFile} from "../interface/object/IFile.js";
import UploadBase from "../util/base/UploadBase.js";

dotenv.config();
export class PlaylistUserRepository implements IPlaylistUserRepository {
    async createUserPlaylist(userId: string, playlistName: string): Promise<void> {
        const playlistRef = database.ref(`user_playlists/${userId}`).push()

        const newPlaylist: IUserPlaylist = {
            title: playlistName,
            description: "",
            coverImage: process.env.DEFAULT_USER_COVER_PATH,
            musicIds:[],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        return await playlistRef.set(newPlaylist)
    }

    async updateUserPlaylist(userId:string, playlistId:string, playlist:IUserPlaylist, coverImage?:IFile): Promise<void> {
        const playlistRef = database.ref(`user_playlists/${userId}/${playlistId}`);

        const snapshot = await playlistRef.get();
        if (!snapshot.exists()) {
            throw new Error(`Playlist is not exist.`);
        }

        if (coverImage) {
            const uploadImgData = await UploadBase.uploadFile(coverImage, playlistId);
            playlist.coverImage = await UploadBase.getSignedFileUrl(uploadImgData) ?? "";
        }

        await playlistRef.update(playlist);
    }

    async deleteUserPlaylist(playlistId: string, userId: string): Promise<void> {
        const playlistRef = database.ref(`user_playlists/${userId}/${playlistId}`);
        const snapshot = await playlistRef.get();
        if (!snapshot.exists()) {
            throw new Error("Playlist not found");
        }
        await playlistRef.remove();
    }

    async getUserPlaylists(userId: string): Promise<IUserPlaylist[]> {
        const playlistsRef = database.ref(`user_playlists/${userId}`);
        const snapshot = await playlistsRef.get();
        if (!snapshot.exists()) {
            return [];
        }
        const playlists = snapshot.val();
        return Object.entries(playlists).map(([key, value]: [string, unknown]) => {
            const playlist = value as IUserPlaylist;
            return {
                ...playlist,
                id: key
            };
        }) as IUserPlaylist[];
    }

    async getUserPlaylistById(userId: string, playlistId: string): Promise<IUserPlaylist> {
        const playlistRef = database.ref(`user_playlists/${userId}/${playlistId}`);
        const snapshot = await playlistRef.get();
        if (!snapshot.exists()) {
            throw new Error("Playlist not found");
        }
        return snapshot.val() as IUserPlaylist;
    }

    async addMusicToUserPlaylist(userId: string, playlistId: string, musicId: string): Promise<void> {
        const playlistRef = database.ref(`user_playlists/${userId}/${playlistId}`);
        const snapshot = await playlistRef.get();
        if (!snapshot.exists()) {
            throw new Error("Playlist not found");
        }

        const playlist = snapshot.val() as IUserPlaylist;
        playlist.musicIds = [...new Set([...(playlist.musicIds || []), { id: musicId }])];
        playlist.updatedAt = new Date().toISOString();

        await playlistRef.update(playlist);
    }

    async removeMusicFromUserPlaylist(userId: string, playlistId: string, musicIds: string[]): Promise<void> {
        const playlistRef = database.ref(`user_playlists/${userId}/${playlistId}`);
        const snapshot = await playlistRef.get();
        if (!snapshot.exists()) {
            throw new Error("Playlist not found");
        }

        const playlist = snapshot.val() as IUserPlaylist;
        playlist.musicIds = playlist.musicIds?.filter(music => !musicIds.includes(music.id));
        playlist.updatedAt = new Date().toISOString();

        await playlistRef.update(playlist);
    }
}

export const playlistUserRepository = new PlaylistUserRepository();