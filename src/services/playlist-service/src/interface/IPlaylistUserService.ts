import {IPlaylist} from "./IPlaylist.js";

export interface IPlaylistUserService {
    createUserPlaylist(userId: string, playlistName: string): Promise<void>;
    updateUserPlaylist(userId: string, playlistId: string, playlistName: string): Promise<void>;
    addMusicToUserPlaylist(userId: string, playlistId: string, musicId: string): Promise<void>;
    removeMusicFromUserPlaylist(userId: string, playlistId: string, musicId: string): Promise<void>;
    getUserPlaylists(userId: string): Promise<IPlaylist[]>;
}