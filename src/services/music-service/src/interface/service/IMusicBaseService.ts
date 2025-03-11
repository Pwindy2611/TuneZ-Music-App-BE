import {IMusic} from "../object/IMusic.js";
import {IMusicFile} from "../object/IMusicFile.js";
import {MusicResponseDto} from "../../dto/response/MusicResponseDto.js";

export interface IMusicBaseService {
    createMusic(music: IMusic, musicFile: IMusicFile, imgFile: IMusicFile): Promise<string | null>;
    updateMusic(id: string, music: IMusic, musicFile?: IMusicFile, imgFile?: IMusicFile): Promise<string | null>;
    deleteMusic(id: string): Promise<string | null>;
    getAllMusic(): Promise<MusicResponseDto[] | null>;
    getMusicByArtist(artist: string): Promise<MusicResponseDto[] | null>;
    getMusicByGenres(genre: string): Promise<MusicResponseDto[] | null>;
    getMusicUrlById(musicId: string): Promise<string>;
    getMusicDurationById(musicId: string): Promise<number>;
}