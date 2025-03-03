import {IPlaylist} from "./IPlaylist.js";

export interface IPlaylistBaseService {
    createPlaylist(name: string, type: string, value: string): Promise<void>;
    getSystemPlaylist(): Promise<IPlaylist[]>;
    getPlaylistByFilter(key: string, values: string | string[]): Promise<IPlaylist[]>;
}