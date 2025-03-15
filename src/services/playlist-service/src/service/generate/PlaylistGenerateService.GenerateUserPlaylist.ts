import {IPlaylistGenerateService} from "../../interface/service/IPlaylistGenerateService.js";
import HistoryBase from "../../util/base/HistoryBase.js";
import PlaylistBaseService from "../base/PlaylistBaseService.js";
import FetchBase from "../../util/base/FetchBase.js";
import {IPlaylist} from "../../interface/object/IPlaylist.js";
import {MusicResponseDto} from "../../dto/response/MusicResponseDto.js";
import PlaylistCacheService from "../cache/PlaylistCacheService.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";
import {PlaylistType} from "../../enum/PlaylistType.js";
import {IPlaylistResponseDto} from "../../dto/response/IPlaylistResponseDto.js";
import {PlaylistTitle} from "../../enum/PlaylistTitle.js";
import {IPlaylistGroupedResponseDto} from "../../dto/response/IPlaylistGroupedResponseDto.js";

export const generateUserPlaylist: IPlaylistGenerateService["generateUserPlaylist"] = async (
    userId
): Promise<IPlaylistGroupedResponseDto | null> => {
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
        if ((!topArtists || topArtists.length === 0) && (!topGenres || topGenres.length === 0)) {
            return null;
        }

        const artistPlaylists = await PlaylistBaseService.getPlaylistByFilter(topArtists, PlaylistType.USER_ARTIST);
        const categoryPlaylists = await PlaylistBaseService.getPlaylistByFilter(topGenres, PlaylistType.USER_GENRE);

        const fetchSongsByArtist = async (artist: string): Promise<MusicResponseDto[]> => {
            const musicIds = await FetchBase.fetchMusicIdsFromArtist(artist, 10);
            return musicIds.length > 0 ? await FetchBase.fetchMusicDetails(musicIds) : [];
        };

        const fetchSongsByCategory = async (genre: string): Promise<MusicResponseDto[]> => {
            const musicIds = await FetchBase.fetchMusicIdsFromGenres(genre, 10);
            return musicIds.length > 0 ? await FetchBase.fetchMusicDetails(musicIds) : [];
        };

        const populatePlaylistsWithSongs = async (
            playlists: IPlaylist[],
            fetchSongsFn: (value: string) => Promise<MusicResponseDto[]>
        ): Promise<IPlaylistResponseDto[]> => {
            return await Promise.all(
                playlists.map(async (playlist) => {
                    const tracks = await fetchSongsFn(playlist.value);
                    return tracks.length > 0 ? {
                        title: playlist.title,
                        coverImage: playlist.coverImage || '',
                        tracks
                    } : null;
                })
            ).then(results => results.filter(playlist => playlist !== null) as IPlaylistResponseDto[]);
        };

        const playlistsByArtist = await populatePlaylistsWithSongs(artistPlaylists, fetchSongsByArtist);
        const playlistsByCategory = await populatePlaylistsWithSongs(categoryPlaylists, fetchSongsByCategory);

        const finalPlaylists = [...playlistsByArtist, ...playlistsByCategory];

        if (finalPlaylists.length === 0) {
            return null;
        }

        await PlaylistCacheService.saveToCache(userId, 'userPreference', finalPlaylists);

        return finalPlaylists.length > 0 ? {[PlaylistTitle.USER_GENERATE]: finalPlaylists} : null;
    } catch (error) {
        throw new Error(`Error generating user playlist: ${error.message}`);
    }
};

