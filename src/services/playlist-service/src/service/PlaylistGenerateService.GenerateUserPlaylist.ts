import {IPlaylistGenerateService} from "../interface/IPlaylistGenerateService.js";
import HistoryBase from "../util/base/HistoryBase.js";
import {PlaylistBaseService} from "./PlaylistBaseService.js";
import FetchBase from "../util/base/FetchBase.js";
import {IPlaylist} from "../interface/IPlaylist.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";
import PlaylistCacheService from "./PlaylistCacheService.js";
import {generateRepo} from "../repository/PlaylistGenerateRepository.js";

export const generateUserPlaylist: IPlaylistGenerateService["generateUserPlaylist"] = async (userId) => {
    try {
        if (!await generateRepo.isUserExists(userId)) {
            return Promise.reject(new Error("User not found"));
        }

        const cachedPlaylist = await PlaylistCacheService.getFromCache(userId, 'userPreference');
        if (cachedPlaylist) {
            console.log(`Using cached user preference playlist for user: ${userId}`);
            return cachedPlaylist;
        }

        console.log(`Generating new user preference playlist for user: ${userId}`);

        const { topArtists, topCategories } = await HistoryBase.getUserPreferences(userId);
        if (!topArtists.length && !topCategories.length) {
            return null;
        }

        const artistPlaylists = await PlaylistBaseService.getPlaylistByFilter('value', topArtists);
        const categoryPlaylists = await PlaylistBaseService.getPlaylistByFilter('value', topCategories);

        const fetchSongsByArtist = async (artist: string): Promise<GetMusicResponseDto[]> => {
            const musicIds = await FetchBase.fetchMusicIdsFromArtist(artist, 10);
            return await FetchBase.fetchMusicDetails(musicIds);
        };

        const fetchSongsByCategory = async (category: string): Promise<GetMusicResponseDto[]> => {
            const musicIds = await FetchBase.fetchMusicIdsFromCategory(category, 10);
            return await FetchBase.fetchMusicDetails(musicIds);
        };

        const populatePlaylistsWithSongs = async (
            playlists: IPlaylist[],
            fetchSongsFn: (value: string) => Promise<GetMusicResponseDto[]>
        ): Promise<Record<string, GetMusicResponseDto[]>> =>
        {
            const populatedPlaylists: Record<string, GetMusicResponseDto[]> = {};

            await Promise.all(playlists.map(async (playlist) => {
                populatedPlaylists[playlist.title] = await fetchSongsFn(playlist.value);
            }));

            return populatedPlaylists;
        };

        const playlistsByArtist = await populatePlaylistsWithSongs(artistPlaylists, fetchSongsByArtist);
        const playlistsByCategory = await populatePlaylistsWithSongs(categoryPlaylists, fetchSongsByCategory);

        const result = { playlistsByArtist, playlistsByCategory };

        await PlaylistCacheService.saveToCache(userId, 'userPreference', result);

        return result;
    }catch (error) {
        throw new Error(`Error generating playlist: ${error.message}`);
    }
}