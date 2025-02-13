import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";

export interface IMusicRecService {
    generateUserPlayList(userId: string): Promise<{
        playlistsByCategory: Record<string, GetMusicResponseDto[]>; // Playlist theo thể loại
        playlistsByArtist: Record<string, GetMusicResponseDto[]>;   // Playlist theo nghệ sĩ
    } | null>;
    generateRecentPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<GetMusicResponseDto[] | null>;
    generateThrowBackPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<GetMusicResponseDto[] | null>;
}