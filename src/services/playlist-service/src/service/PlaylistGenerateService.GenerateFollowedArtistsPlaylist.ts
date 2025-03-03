import {IPlaylistGenerateService} from "../interface/IPlaylistGenerateService.js";
import {auth, database, firestore} from "../config/firebase/FireBaseConfig.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";
import FetchBase from "../util/base/FetchBase.js";
import PlaylistCacheService from "./PlaylistCacheService.js";
import {PlaylistBaseService} from "./PlaylistBaseService.js";

export const generateFollowedArtistsPlaylist: IPlaylistGenerateService["generateFollowedArtistsPlaylist"] = async (userId) => {
    try {
        if(!await auth.getUser(userId)) {
            return Promise.reject(new Error("User not found"));
        }

        const cachedPlaylist = await PlaylistCacheService.getFromCache(userId, 'followed');
        if (cachedPlaylist) {
            console.log(`Using cached followed playlist for user: ${userId}`);
            return cachedPlaylist;
        }

        const followingRef = firestore.collection('users').doc(userId).collection('following');
        const followingSnapshot = await followingRef.where('followType', '==', 'officialArtist').get();

        const artistIds  = followingSnapshot.docs.map(doc => doc.data().followingId);

        if (artistIds .length === 0) return null;

        const artistPromises = artistIds.map(async (artistId) => {
            const artistRef = database.ref(`/officialArtist/${artistId}`);
            const snapshot = await artistRef.once('value');
            if (!snapshot.exists()) return null;

            return {
                artistId,
                artistName: snapshot.val().name
            };
        });

        const artists = (await Promise.all(artistPromises)).filter((artist): artist is { artistId: string; artistName: string } => artist !== null);


        const artistMusicPromises = artists.map(async ({ artistId, artistName }) => {
            const artistPlaylists = await PlaylistBaseService.getPlaylistByFilter('value', artistName);

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

        const playlistByFollowed: Record<string, GetMusicResponseDto[]> = {};
        artistMusicDetails.flat().forEach(({ title, musicDetails }) => {
            if (!playlistByFollowed[title]) {
                playlistByFollowed[title] = [];
            }
            playlistByFollowed[title].push(...musicDetails);
        });

        const result = Object.keys(playlistByFollowed).length > 0 ? { playlistByFollowed } : null;

        if(result){
            await PlaylistCacheService.saveToCache(userId, 'followed', result);
        }

        return result;
    }catch (error) {
        throw new Error(`Failed to generate followed artists playlist for user: ${error.message}`);
    }
}