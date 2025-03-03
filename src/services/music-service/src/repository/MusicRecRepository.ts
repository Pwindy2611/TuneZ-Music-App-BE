import {singleton} from "tsyringe";
import {IMusicRecRepository} from "../interface/IMusicRecRepository.js";
import {auth, database, firestore} from "../config/firebase/FireBaseConfig.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";
import {MusicBaseService} from "../service/music_base/MusicBaseService.js";
import FetchBase from "../util/base/FetchBase.js";
import {Timestamp} from "firebase-admin/firestore";
import HistoryBase from "../util/base/HistoryBase.js";

@singleton()
export class MusicRecRepository implements IMusicRecRepository {
    async generateFollowedArtistsPlaylist(userId: string): Promise<any> {
        try {
            if(!await this.isUserExist(userId)) {
                return Promise.reject(new Error("User not found"));
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
                const musicDetails: GetMusicResponseDto[] = await MusicBaseService.getMusicByArtist.execute(artistName) ?? [];
                return { artistId, artistName, musicDetails };
            });

            const artistMusicDetails = await Promise.all(artistMusicPromises);

            const playlistByFollowed: Record<string, GetMusicResponseDto[]> = {};
            artistMusicDetails.forEach(item => {
                if (item.musicDetails && item.musicDetails.length > 0) {
                    playlistByFollowed[item.artistName] = item.musicDetails;
                }
            });

            return Object.keys(playlistByFollowed).length > 0 ? { playlistByFollowed } : null;
        }catch (error) {
            throw new Error(error.message);
        }
    }

    async generateRecentPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<any> {
        try {
            if(!await this.isUserExist(userId)) {
                return Promise.reject(new Error("User not found"));
            }
            const musicIds = await FetchBase.fetchMusicIdsFromHistory(userId, historyLimit);

            const musicCount: { [key: string]: number } = {};
            musicIds.forEach(musicId => {
                musicCount[musicId] = (musicCount[musicId] || 0) + 1;
            });

            const sortedMusicIds = Object.entries(musicCount)
                .sort((a, b) => b[1] - a[1])
                .map(entry => entry[0]);

            const topMusicIds = sortedMusicIds.slice(0, playlistLimit);

            const musicDetails = await FetchBase.fetchMusicDetails(topMusicIds);
            return musicDetails.length > 0 ? musicDetails : null;
        }catch (error) {
            throw new Error(error.message);
        }
    }

    async generateThrowBackPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<any> {
        try {
            if(!await this.isUserExist(userId)) {
                return Promise.reject(new Error("User not found"));
            }

            const cutoffDate = new Date();
            cutoffDate.setMonth(cutoffDate.getMonth() - 6);
            const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

            const historySnapshot = await firestore
                .collection(`history`)
                .doc(userId)
                .collection('data')
                .where('listenAt', '<', cutoffTimestamp)
                .orderBy('listenAt', 'desc')
                .limit(historyLimit)
                .get();

            const musicIds = historySnapshot.docs.map(doc => doc.data().musicId);

            const frequencyMap: Record<string, number> = {};
            musicIds.forEach(id => {
                frequencyMap[id] = (frequencyMap[id] || 0) + 1;
            });

            const sortedIds = Object.entries(frequencyMap)
                .sort((a, b) => b[1] - a[1])
                .map(([id]) => id)
                .slice(0, playlistLimit);

            const musicDetails = await FetchBase.fetchMusicDetails(sortedIds);
            return musicDetails.length > 0 ? musicDetails : null;

        }catch (error){
            throw new Error(error.message);
        }
    }

    async generateUserPlaylist(userId: string): Promise<any> {
        try {
            if(!await this.isUserExist(userId)) {
                return Promise.reject(new Error("User not found"));
            }
            const {topArtists, topCategories} = await HistoryBase.getUserPreferences(userId)

            if (!topArtists.length && !topCategories.length) {
                return null;
            }

            const artistPromises = topArtists.map(artist =>
                MusicBaseService.getMusicByArtist.execute(artist).then(songs => ({ artist, songs: songs ?? [] }))
            );

            const categoryPromises = topCategories.map(category =>
                MusicBaseService.getMusicByCategory.execute(category).then(songs => ({ category, songs: songs ?? [] }))
            );

            const [artistResults, categoryResults] = await Promise.all([
                Promise.all(artistPromises),
                Promise.all(categoryPromises)
            ]);

            const playlistsByArtist: Record<string, GetMusicResponseDto[]> = {};
            artistResults.forEach(({ artist, songs }) => {
                playlistsByArtist[artist] = songs;
            });

            const playlistsByCategory: Record<string, GetMusicResponseDto[]> = {};
            categoryResults.forEach(({ category, songs }) => {
                playlistsByCategory[category] = songs;
            });

            return { playlistsByArtist, playlistsByCategory };
        }catch (error){
            throw new Error(error.message);
        }
    }

    async isUserExist(userId: string): Promise<boolean> {
        return !!(await auth.getUser(userId));
    }


}