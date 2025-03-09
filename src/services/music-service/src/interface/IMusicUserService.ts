import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";
import {IMusic} from "./IMusic.js";
import {IMusicFile} from "./IMusicFile.js";

export interface IMusicUserService{
    uploadMusicByUser(music: IMusic, musicFile: IMusicFile, imgFile: IMusicFile): Promise<string | null>;
    getMusicHistory(userId: string): Promise<GetMusicResponseDto[] | null>;
    getMusicLove(userId: string): Promise<GetMusicResponseDto[] | null>;
}