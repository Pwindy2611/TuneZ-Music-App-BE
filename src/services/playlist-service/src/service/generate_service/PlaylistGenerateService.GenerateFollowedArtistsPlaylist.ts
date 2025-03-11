import { IPlaylistGenerateService } from "../../interface/service/IPlaylistGenerateService.js";
import { MusicResponseDto } from "../../dto/response/MusicResponseDto.js";
import FetchBase from "../../util/base/FetchBase.js";
import PlaylistCacheService from "../base/PlaylistCacheService.js";
import { PlaylistBaseService } from "../base/PlaylistBaseService.js";
import { generateRepo } from "../../repository/PlaylistGenerateRepository.js";
import { PlaylistType } from "../../enum/PlaylistType.js";
import {IPlaylistResponseDto} from "../../dto/response/IPlaylistResponseDto.js";

export const generateFollowedArtistsPlaylist: IPlaylistGenerateService["generateFollowedArtistsPlaylist"] = async (userId): Promise<IPlaylistResponseDto[] | null> => {
    try {
        if (!await generateRepo.isUserExists(userId)) {
            return Promise.reject(new Error("User not found"));
        }

        const cachedPlaylist = await PlaylistCacheService.getFromCache(userId, 'followed-artist');
        if (cachedPlaylist) {
            console.log(`Using cached followed playlist for user: ${userId}`);
            return cachedPlaylist;
        }

        const artistIds = await generateRepo.getIdsArtistFollowed(userId);
        if (artistIds.length === 0) return null;

        const artistPlaylists: IPlaylistResponseDto[] = [];

        for (const artistId of artistIds) {
            const artistName = await generateRepo.getArtistName(artistId);
            if (!artistName) continue;

            const playlists = await PlaylistBaseService.getPlaylistByFilter(artistName, PlaylistType.FOLLOWED_ARTIST);
            if (!playlists || playlists.length === 0) continue;

            const musicIds = await FetchBase.fetchMusicIdsFromArtist(artistName, 20);
            const musicDetails = await FetchBase.fetchMusicDetails(musicIds);

            for (const playlist of playlists) {
                artistPlaylists.push({
                    title: playlist.title,
                    coverImage: playlist.coverImage || 'https://example.com/default-cover.jpg', // Giá trị mặc định
                    tracks: musicDetails
                });
            }
        }

        if (artistPlaylists.length > 0) {
            await PlaylistCacheService.saveToCache(userId, 'followed-artists', artistPlaylists);
        }

        return artistPlaylists.length > 0 ? artistPlaylists : null;
    } catch (error) {
        throw new Error(`Failed to generate followed artists playlist for user: ${error.message}`);
    }
};
