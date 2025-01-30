import {Music} from "./music.interface.js";
import {MusicFile} from "./musicFile.interface.js";

export interface IMusicService {
    createMusic(music: Music, musicFile: MusicFile): Promise<string>;
    getAllMusic(): Promise<Record<string, Music> | null>;
    getMusicByArtist(artist: string): Promise<Record<string, Music> | null>;
    getMusicByCategory(category: string): Promise<Record<string, Music> | null>;
}