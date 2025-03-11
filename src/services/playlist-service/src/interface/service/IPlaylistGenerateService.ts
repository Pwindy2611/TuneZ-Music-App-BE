import {IPlaylistResponseDto} from "../../dto/response/IPlaylistResponseDto.js";

export interface IPlaylistGenerateService {
    generateUserPlaylist(userId: string): Promise<IPlaylistResponseDto[] | null>
    generateRecentPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<IPlaylistResponseDto[] | null>;
    generateThrowBackPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<IPlaylistResponseDto[] | null>;
    generateFollowedArtistsPlaylist(userId: string): Promise<IPlaylistResponseDto[] | null>;
    generateFollowedGenresPlaylist(userId: string): Promise<IPlaylistResponseDto[] | null>;
}