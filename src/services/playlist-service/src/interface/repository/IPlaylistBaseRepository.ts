import {IPlaylist} from "../object/IPlaylist.js";
import {IFile} from "../object/IFile.js";

export interface IPlaylistBaseRepository {
    createPlaylist(playlist: IPlaylist, imgFile: IFile): Promise<void>;
    updatePlaylist(id: string, playlist: IPlaylist, imgFile?: IFile): Promise<void>;
    deletePlaylist(id: string): Promise<void>;
    getPlaylistByFilter(value: string[] | string, type: string): Promise<IPlaylist[]>;
    getAllPlaylists(): Promise<IPlaylist[]>;
}