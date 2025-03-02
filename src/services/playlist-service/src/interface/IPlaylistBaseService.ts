import {IPlaylist} from "./IPlaylist.js";

export interface IPlaylistBaseService {
    createPlaylist(name: string, type: string, value: string): Promise<void>;
    getSystemPlaylist(): Promise<IPlaylist[]>;
    getPlaylistByCategory(categories: string[]): Promise<IPlaylist[]>;
    getPlaylistByArtist(artists: string[]): Promise<IPlaylist[]>;
}