import {IPlaylistResponseDto} from "../../dto/response/IPlaylistResponseDto.js";
import {IPlaylistGroupedResponseDto} from "../../dto/response/IPlaylistGroupedResponseDto.js";

export interface IPlaylistGenerateService {
    generateUserPlaylist(userId: string): Promise<IPlaylistGroupedResponseDto | null>
    generateRecentPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<IPlaylistResponseDto[] | null>;
    generateThrowBackPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<IPlaylistResponseDto[] | null>;
    generateUniquePlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<IPlaylistGroupedResponseDto | null>;
    generateFollowedArtistsPlaylist(userId: string): Promise<IPlaylistGroupedResponseDto| null>;
    generateFollowedGenresPlaylist(userId: string): Promise<IPlaylistGroupedResponseDto | null>;
}