import {IPlaylistGenerateService} from "../interface/IPlaylistGenerateService.js";
import {generateRepo} from "../repository/PlaylistGenerateRepository.js";
import PlaylistCacheService from "./PlaylistCacheService.js";
import {PlaylistBaseService} from "./PlaylistBaseService.js";
import FetchBase from "../util/base/FetchBase.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";

export const generateFollowedGenresPlaylist: IPlaylistGenerateService["generateFollowedGenresPlaylist"] = async (userId) => {
    try {
        if(!await generateRepo.isUserExists(userId)){
            return Promise.reject(new Error("User not found"));
        }

        const cachedPlaylist = await PlaylistCacheService.getFromCache(userId, 'followed-genres');
        if (cachedPlaylist) {
            console.log(`Using cached followed playlist for user: ${userId}`);
            return cachedPlaylist;
        }

        const artistIds  = await generateRepo.getIdsArtistFollowed(userId);

        if (artistIds .length === 0) return null;

        const artistPromises = artistIds.map(async (artistId) => {
            const genre = await generateRepo.getGenresFromArtist(artistId)
            return {
                genres: genre
            };
        });

        const artists = (await Promise.all(artistPromises)).filter((artist): artist is {genres: string} => artist !== null);

        const artistMusicPromises = artists.map(async ({genres}) => {
            const artistPlaylists = await PlaylistBaseService.getPlaylistByFilter('value', genres);

            if (!artistPlaylists || artistPlaylists.length === 0) {
                throw new Error(`No playlist found for artist: ${genres}`);
            }

            const musicIds = await FetchBase.fetchMusicIdsFromGenre(genres, 20);
            const musicDetails = await FetchBase.fetchMusicDetails(musicIds);

            return artistPlaylists.map(playlist => ({
                title: playlist.title,
                musicDetails
            }));
        });

        const artistMusicDetails = await Promise.all(artistMusicPromises);

        const playlistByFollowed: Record<string, GetMusicResponseDto[]> = {};
        artistMusicDetails.flat().forEach(({ title, musicDetails }) => {
            if (!playlistByFollowed[title]) {
                playlistByFollowed[title] = [];
            }
            playlistByFollowed[title].push(...musicDetails);
        });

        const result = Object.keys(playlistByFollowed).length > 0 ? { playlistByFollowed } : null;

        if(result){
            await PlaylistCacheService.saveToCache(userId, 'followed-genres', result);
        }

        return result;
    }catch (error) {
        throw new Error(`Failed to generate followed artists playlist for user: ${error.message}`);
    }
}