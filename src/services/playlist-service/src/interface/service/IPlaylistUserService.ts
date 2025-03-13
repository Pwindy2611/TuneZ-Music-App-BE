import {IPlaylist} from "../object/IPlaylist.js";
import {IFile} from "../object/IFile.js";
import {IUserPlaylist} from "../object/IUserPlaylist.js";

export interface IPlaylistUserService {
    createUserPlaylist(userId: string, title: string): Promise<void>;
    updateUserPlaylist(userId: string, playlistId: string, playlist: IUserPlaylist, coverImage?: IFile): Promise<void>;
    deleteUserPlaylist(userId: string, playlistId: string): Promise<void>;
    addMusicToUserPlaylist(userId: string, playlistId: string, musicId: string): Promise<void>;
    removeMusicFromUserPlaylist(userId: string, playlistId: string, musicIds: string[]): Promise<void>;
    getUserPlaylists(userId: string): Promise<IUserPlaylist[]>;
}