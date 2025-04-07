import {MusicResponseDto} from "./MusicResponseDto.js";

export interface IPlaylistResponseDto {
    title: string;
    coverImage?: string;
    tracks: MusicResponseDto[];
}
