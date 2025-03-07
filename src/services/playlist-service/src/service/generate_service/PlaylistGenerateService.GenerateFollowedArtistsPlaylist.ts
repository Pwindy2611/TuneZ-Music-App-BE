import {IPlaylistGenerateService} from "../../interface/IPlaylistGenerateService.js";
import {GetMusicResponseDto} from "../../dto/GetMusicResponseDto.js";
import FetchBase from "../../util/base/FetchBase.js";
import PlaylistCacheService from "../base/PlaylistCacheService.js";
import {PlaylistBaseService} from "../base/PlaylistBaseService.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";
import {PlaylistType} from "../../enum/PlaylistType.js";

export const generateFollowedArtistsPlaylist: IPlaylistGenerateService["generateFollowedArtistsPlaylist"] = async (userId) => {
    try {
        if(!await generateRepo.isUserExists(userId)) {//
            return Promise.reject(new Error("User not found"));
        }

        const cachedPlaylist = await PlaylistCacheService.getFromCache(userId, 'followed-artist');
        if (cachedPlaylist) {
            console.log(`Using cached followed playlist for user: ${userId}`);
            return cachedPlaylist;
        }


        const artistIds  = await generateRepo.getIdsArtistFollowed(userId);

        if (artistIds .length === 0) return null;

        const artistPromises = artistIds.map(async (artistId) => {
            const name = await generateRepo.getArtistName(artistId)
            return {
                artistName: name
            };
        });

        const artists = (await Promise.all(artistPromises)).filter((artist): artist is {artistName: string } => artist !== null);


        const artistMusicPromises = artists.map(async ({artistName }) => {
            const artistPlaylists = await PlaylistBaseService.getPlaylistByFilter(artistName, PlaylistType.FOLLOWED_ARTIST);

            if (!artistPlaylists || artistPlaylists.length === 0) {
                throw new Error(`No playlist found for artist: ${artistName}`);
            }

            const musicIds = await FetchBase.fetchMusicIdsFromArtist(artistName, 20);
            const musicDetails = await FetchBase.fetchMusicDetails(musicIds);

            return artistPlaylists.map(playlist => ({
                title: playlist.title,
                musicDetails
            }));
        });


        const artistMusicDetails = await Promise.all(artistMusicPromises);

        const followedPlaylistByArtistName: Record<string, GetMusicResponseDto[]> = {};
        artistMusicDetails.flat().forEach(({ title, musicDetails }) => {
            if (!followedPlaylistByArtistName[title]) {
                followedPlaylistByArtistName[title] = [];
            }
            followedPlaylistByArtistName[title].push(...musicDetails);
        });

        const result = Object.keys(followedPlaylistByArtistName).length > 0 ? { followedPlaylistByArtistName } : null;

        if(result){
            await PlaylistCacheService.saveToCache(userId, 'followed-artists', result);
        }

        return result;
    }catch (error) {
        throw new Error(`Failed to generate followed artists playlist for user: ${error.message}`);
    }
}