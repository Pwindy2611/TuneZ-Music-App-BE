import {IPlaylist} from "./IPlaylist.js";

export interface IPlaylistBaseRepository {
    createPlaylist(playlist: IPlaylist): Promise<void>;
    getPlaylistByFilter(key:string, value: string[] | string): Promise<IPlaylist[]>;
}