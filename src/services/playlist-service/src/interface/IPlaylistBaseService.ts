import {IPlaylist} from "./IPlaylist.js";

export interface IPlaylistBaseService {
    createPlaylist(name: string, type: string, value: string): Promise<void>;
    getSystemPlaylist(): Promise<IPlaylist[]>;
    getPlaylistByFilter(values: string | string[], type: string): Promise<IPlaylist[]>;
}