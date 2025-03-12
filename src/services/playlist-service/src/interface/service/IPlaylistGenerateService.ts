import {MusicResponseDto} from "../../dto/response/MusicResponseDto.js";

export interface IPlaylistGenerateService {
    generateUserPlaylist(userId: string): Promise<{
        playlistsByCategory: Record<string, MusicResponseDto[]>;
        playlistsByArtist: Record<string, MusicResponseDto[]>;
    } | null>;
    generateRecentPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<Record<string, MusicResponseDto[]> | null>;
    generateThrowBackPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<Record<string, MusicResponseDto[]> | null>;
    generateFollowedArtistsPlaylist(userId: string): Promise<Record<string, MusicResponseDto[]> | null>;
    generateFollowedGenresPlaylist(userId: string): Promise<Record<string, MusicResponseDto[]> | null>;
}