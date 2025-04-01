import {IUserPlaylist} from "../object/IUserPlaylist.js";
import {IFile} from "../object/IFile.js";

export interface IPlaylistUserRepository {
    createUserPlaylist(userId: string, playlistName: string): Promise<void>;
    deleteUserPlaylist(playlistId: string, userId: string): Promise<void>;
    updateUserPlaylist(userId:string, playlistId:string, playlist: IUserPlaylist, coverImage?: IFile): Promise<void>;
    getUserPlaylists(userId: string): Promise<IUserPlaylist[]>;
    getUserPlaylistById(userId: string, playlistId: string): Promise<IUserPlaylist>;
    addMusicToUserPlaylist(userId: string, playlistId: string, musicId: string): Promise<void>;
    removeMusicFromUserPlaylist(userId: string, playlistId: string, musicIds: string[]): Promise<void>;
}