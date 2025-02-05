import {IMusic} from "./IMusic.js";
import {IMusicFile} from "./IMusicFile.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";

export interface IMusicBaseService {
    createMusic(music: IMusic, musicFile: IMusicFile): Promise<string | null>;
    getAllMusic(): Promise<GetMusicResponseDto[] | null>;
    getMusicByArtist(artist: string): Promise<GetMusicResponseDto[] | null>;
    getMusicByCategory(category: string): Promise<GetMusicResponseDto[] | null>;
    getMusicHistory(userId: string): Promise<GetMusicResponseDto[] | null>;
}