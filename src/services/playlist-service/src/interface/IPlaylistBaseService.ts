import {IPlaylist} from "./IPlaylist.js";

export interface IPlaylistBaseService {
    createPlaylist(playlist: IPlaylist): Promise<void>;
    updatePlaylist(id: string, playlist: IPlaylist): Promise<void>;
    deletePlaylist(id: string): Promise<void>;
    getSystemPlaylist(): Promise<IPlaylist[]>;
    getPlaylistByFilter(values: string | string[], type: string): Promise<IPlaylist[]>;
}