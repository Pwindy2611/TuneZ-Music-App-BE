import {MusicResponseDto} from "../../dto/response/MusicResponseDto.js";
import {IMusic} from "../object/IMusic.js";
import {IMusicFile} from "../object/IMusicFile.js";

export interface IMusicUserService{
    uploadMusicByUser(music: IMusic, musicFile: IMusicFile, imgFile: IMusicFile): Promise<string | null>;
    getMusicHistory(userId: string): Promise<MusicResponseDto[] | null>;
    getMusicLove(userId: string): Promise<MusicResponseDto[] | null>;
    getUserMusic(userId: string): Promise<MusicResponseDto[] | null>;
}