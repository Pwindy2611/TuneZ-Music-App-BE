import {IMusic} from "./music.interface.js";
import {IMusicFile} from "./musicFile.interface.js";

export interface IMusicService {
    createMusic(music: IMusic, musicFile: IMusicFile): Promise<string>;
    getAllMusic(): Promise<Record<string, IMusic> | null>;
    getMusicByArtist(artist: string): Promise<Record<string, IMusic> | null>;
    getMusicByCategory(category: string): Promise<Record<string, IMusic> | null>;
}