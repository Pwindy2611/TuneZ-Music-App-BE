import {IPlaylistGenerateService} from "../../interface/service/IPlaylistGenerateService.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";
import PlaylistCacheService from "../cache/PlaylistCacheService.js";
import PlaylistBaseService from "../base/PlaylistBaseService.js";
import FetchBase from "../../util/base/FetchBase.js";
import {PlaylistType} from "../../enum/PlaylistType.js";
import {IPlaylistResponseDto} from "../../dto/response/IPlaylistResponseDto.js";
import {IPlaylistGroupedResponseDto} from "../../dto/response/IPlaylistGroupedResponseDto.js";
import {PlaylistTitle} from "../../enum/PlaylistTitle.js";

export const generateFollowedGenresPlaylist: IPlaylistGenerateService["generateFollowedGenresPlaylist"] = async (userId): Promise<IPlaylistGroupedResponseDto | null> => {
    try {
        if (!await generateRepo.isUserExists(userId)) {
            return Promise.reject(new Error("User not found"));
        }

        const cachedPlaylist = await PlaylistCacheService.getFromCache(userId, 'followed-genres');
        if (cachedPlaylist) {
            console.log(`Using cached followed playlist for user: ${userId}`);
            return {[PlaylistTitle.FOLLOW_GENRE]: cachedPlaylist};
        }

        const artistIds = await generateRepo.getIdsArtistFollowed(userId);
        if (!artistIds || artistIds.length === 0) {
            return null;
        }

        const genrePlaylistsMap = new Map<string, IPlaylistResponseDto>();

        for (const artistId of artistIds) {
            const genres = await generateRepo.getGenresFromArtist(artistId);
            if (!genres || genres.length === 0) continue;

            for (const genre of genres) {
                if (genrePlaylistsMap.has(genre.id)) continue;

                const playlists = await PlaylistBaseService.getPlaylistByFilter(genre.name, PlaylistType.FOLLOWED_GENRE);
                if (!playlists || playlists.length === 0) continue;

                const musicIds = await FetchBase.fetchMusicIdsFromGenres(genre.name);
                const musicDetails = await FetchBase.fetchMusicDetails(musicIds);

                genrePlaylistsMap.set(genre.id, {
                    title: playlists[0].title,
                    coverImage: playlists[0].coverImage || '',
                    tracks: musicDetails
                });
            }
        }

        const genrePlaylists = Array.from(genrePlaylistsMap.values());

        if (genrePlaylists.length > 0) {
            await PlaylistCacheService.saveToCache(userId, 'followed-genres', genrePlaylists);
        }

        return genrePlaylists.length > 0 ? {[PlaylistTitle.FOLLOW_GENRE]: genrePlaylists} : null;
    } catch (error) {
        throw new Error(`Failed to generate followed genres playlist for user: ${error.message}`);
    }
};

