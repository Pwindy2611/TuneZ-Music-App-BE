import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";

export interface IPlaylistGenerateService {
    generateUserPlaylist(userId: string): Promise<{
        playlistsByCategory: Record<string, GetMusicResponseDto[]>;
        playlistsByArtist: Record<string, GetMusicResponseDto[]>;
    } | null>;
}