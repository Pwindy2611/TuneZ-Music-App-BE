import {IPlaylistGenerateService} from "../../interface/service/IPlaylistGenerateService.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";
import PlaylistCacheService from "../cache/PlaylistCacheService.js";
import PlaylistBaseService from "../base/PlaylistBaseService.js";
import FetchBase from "../../util/base/FetchBase.js";
import {PlaylistType} from "../../enum/PlaylistType.js";
import {IPlaylistResponseDto} from "../../dto/response/IPlaylistResponseDto.js";

export const generateFollowedGenresPlaylist: IPlaylistGenerateService["generateFollowedGenresPlaylist"] = async (userId): Promise<IPlaylistResponseDto[] | null> => {
    try {
        if (!await generateRepo.isUserExists(userId)) {
            return Promise.reject(new Error("User not found"));
        }

        const cachedPlaylist = await PlaylistCacheService.getFromCache(userId, 'followed-genres');
        if (cachedPlaylist) {
            console.log(`Using cached followed playlist for user: ${userId}`);
            return cachedPlaylist;
        }

        const artistIds = await generateRepo.getIdsArtistFollowed(userId);
        if (artistIds.length === 0) return null;

        const genrePlaylists: IPlaylistResponseDto[] = [];

        for (const artistId of artistIds) {
            const genre = await generateRepo.getGenresFromArtist(artistId);
            if (!genre) continue;

            const playlists = await PlaylistBaseService.getPlaylistByFilter(genre, PlaylistType.FOLLOWED_GENRE);
            if (!playlists || playlists.length === 0) continue;

            const musicIds = await FetchBase.fetchMusicIdsFromGenre(genre, 20);
            const musicDetails = await FetchBase.fetchMusicDetails(musicIds);

            for (const playlist of playlists) {
                genrePlaylists.push({
                    title: playlist.title,
                    coverImage: playlist.coverImage || 'https://example.com/default-cover.jpg', // Giá trị mặc định
                    tracks: musicDetails
                });
            }
        }

        if (genrePlaylists.length > 0) {
            await PlaylistCacheService.saveToCache(userId, 'followed-genres', genrePlaylists);
        }

        return genrePlaylists.length > 0 ? genrePlaylists : null;
    } catch (error) {
        throw new Error(`Failed to generate followed genres playlist for user: ${error.message}`);
    }
};

