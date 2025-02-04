import {IMusic} from "./IMusic.js";
import {IMusicFile} from "./IMusicFile.js";

export interface IMusicBaseService {
    createMusic(music: IMusic, musicFile: IMusicFile, userId: string): Promise<string | null>;
    getAllMusic(): Promise<Record<string, IMusic> | null>;
    getMusicByArtist(artist: string): Promise<Record<string, IMusic> | null>;
    getMusicByCategory(category: string): Promise<Record<string, IMusic> | null>;
}