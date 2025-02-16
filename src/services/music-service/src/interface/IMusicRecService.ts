import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";

export interface IMusicRecService {
    generateUserPlayList(userId: string): Promise<{
        playlistsByCategory: Record<string, GetMusicResponseDto[]>;
        playlistsByArtist: Record<string, GetMusicResponseDto[]>;
    } | null>;
    generateRecentPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<GetMusicResponseDto[] | null>;
    generateThrowBackPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<GetMusicResponseDto[] | null>;
}