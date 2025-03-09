import {IPlaylist} from "./IPlaylist.js";

export interface IPlaylistBaseRepository {
    createPlaylist(playlist: IPlaylist): Promise<void>;
    getPlaylistByFilter(value: string[] | string, type: string): Promise<IPlaylist[]>;
}