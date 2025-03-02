import {IPlaylistGenerateService} from "../interface/IPlaylistGenerateService.js";
import HistoryBase from "../util/base/HistoryBase.js";
import {auth} from "../config/firebase/FireBaseConfig.js";
import {PlaylistBaseService} from "./PlaylistBaseService.js";
import FetchBase from "../util/base/FetchBase.js";
import {IPlaylist} from "../interface/IPlaylist.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";

export const generateUserPlaylist: IPlaylistGenerateService["generateUserPlaylist"] = async (userId) => {
    try {
        if (!await auth.getUser(userId)) {
            return Promise.reject(new Error("User not found"));
        }

        // Lấy top nghệ sĩ và thể loại mà user nghe nhiều nhất
        const { topArtists, topCategories } = await HistoryBase.getUserPreferences(userId);
        if (!topArtists.length && !topCategories.length) {
            return null;
        }

        // Lấy danh sách playlist từ database
        const artistPlaylists: IPlaylist[] = await PlaylistBaseService.getPlaylistByArtist(topArtists);
        const categoryPlaylists: IPlaylist[] = await PlaylistBaseService.getPlaylistByCategory(topCategories);

        // Hàm fetch nhạc từ music-service theo artist
        const fetchSongsByArtist = async (artist: string): Promise<GetMusicResponseDto[]> => {
            const musicIds = await FetchBase.fetchMusicIdsFromArtist(artist, 10);
            return await FetchBase.fetchMusicDetails(musicIds);
        };

        // Hàm fetch nhạc từ music-service theo category
        const fetchSongsByCategory = async (category: string): Promise<GetMusicResponseDto[]> => {
            const musicIds = await FetchBase.fetchMusicIdsFromCategory(category, 10);
            return await FetchBase.fetchMusicDetails(musicIds);
        };

        // Hàm lấy danh sách nhạc cho mỗi playlist
        const populatePlaylistsWithSongs = async (
            playlists: IPlaylist[],
            fetchSongsFn: (value: string) => Promise<GetMusicResponseDto[]>
        ): Promise<Record<string, GetMusicResponseDto[]>> => {
            const populatedPlaylists: Record<string, GetMusicResponseDto[]> = {};

            await Promise.all(playlists.map(async (playlist) => {
                populatedPlaylists[playlist.value] = await fetchSongsFn(playlist.value);
            }));

            return populatedPlaylists;
        };

        // Lấy danh sách bài hát theo playlist của artist & category
        const playlistsByArtist = await populatePlaylistsWithSongs(artistPlaylists, fetchSongsByArtist);
        const playlistsByCategory = await populatePlaylistsWithSongs(categoryPlaylists, fetchSongsByCategory);

        return { playlistsByArtist, playlistsByCategory };
    }catch (error) {
        throw new Error(`Error generating playlist: ${error.message}`);
    }
}