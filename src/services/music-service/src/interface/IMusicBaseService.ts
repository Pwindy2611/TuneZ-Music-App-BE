import {IMusic} from "./IMusic.js";
import {IMusicFile} from "./IMusicFile.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";

export interface IMusicBaseService {
    createMusic(music: IMusic, musicFile: IMusicFile, imgFile: IMusicFile): Promise<string | null>;
    getAllMusic(): Promise<GetMusicResponseDto[] | null>;
    getMusicByArtist(artist: string): Promise<GetMusicResponseDto[] | null>;
    getMusicByGenres(genre: string): Promise<GetMusicResponseDto[] | null>;
    getMusicHistory(userId: string): Promise<GetMusicResponseDto[] | null>;
    getMusicLove(userId: string): Promise<GetMusicResponseDto[] | null>;
    uploadMusicByUser(music: IMusic, musicFile: IMusicFile, imgFile: IMusicFile): Promise<string | null>;
}