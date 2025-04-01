import {IPlaylistResponseDto} from "./IPlaylistResponseDto.js";

export interface IPlaylistGroupedResponseDto {
    [key: string]: IPlaylistResponseDto[];
}