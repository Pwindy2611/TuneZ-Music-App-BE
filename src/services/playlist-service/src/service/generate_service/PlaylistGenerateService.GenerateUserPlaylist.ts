import {IPlaylistGenerateService} from "../../interface/IPlaylistGenerateService.js";
import HistoryBase from "../../util/base/HistoryBase.js";
import {PlaylistBaseService} from "../base/PlaylistBaseService.js";
import FetchBase from "../../util/base/FetchBase.js";
import {IPlaylist} from "../../interface/IPlaylist.js";
import {GetMusicResponseDto} from "../../dto/GetMusicResponseDto.js";
import PlaylistCacheService from "../base/PlaylistCacheService.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";

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

        const { topArtists, topGenres } = await HistoryBase.getUserPreferences(userId);
        if (!topArtists.length && !topGenres.length) {
            return null;
        }

        const artistPlaylists = await PlaylistBaseService.getPlaylistByFilter('value', topArtists);
        const categoryPlaylists = await PlaylistBaseService.getPlaylistByFilter('value', topGenres);

        const fetchSongsByArtist = async (artist: string): Promise<GetMusicResponseDto[]> => {
            const musicIds = await FetchBase.fetchMusicIdsFromArtist(artist, 10);
            return await FetchBase.fetchMusicDetails(musicIds);
        };

        const fetchSongsByCategory = async (genre: string): Promise<GetMusicResponseDto[]> => {
            const musicIds = await FetchBase.fetchMusicIdsFromGenres(genre, 10);
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
        const playlistsByGenres = await populatePlaylistsWithSongs(categoryPlaylists, fetchSongsByCategory);

        const result = { playlistsByArtist, playlistsByCategory: playlistsByGenres };

        await PlaylistCacheService.saveToCache(userId, 'userPreference', result);

        return result;
    }catch (error) {
        throw new Error(`Error generating playlist: ${error.message}`);
    }
}