import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";

export interface IPlaylistGenerateService {
    generateUserPlaylist(userId: string): Promise<{
        playlistsByCategory: Record<string, GetMusicResponseDto[]>;
        playlistsByArtist: Record<string, GetMusicResponseDto[]>;
    } | null>;
    generateRecentPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<{[title: string]: GetMusicResponseDto[]} | null>;
    generateThrowBackPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<{[title: string]: GetMusicResponseDto[]} | null>;
    generateFollowedArtistsPlaylist(userId: string): Promise<Record<string, GetMusicResponseDto[]> | null>;
    generateFollowedGenresPlaylist(userId: string): Promise<Record<string, GetMusicResponseDto[]> | null>;
}