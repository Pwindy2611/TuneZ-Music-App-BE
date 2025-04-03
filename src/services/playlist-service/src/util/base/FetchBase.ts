import {database, firestore} from '../../config/firebase/FireBaseConfig.js'
import {MusicResponseDto} from "../../dto/response/MusicResponseDto.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";

class FetchBase {
    async fetchMusicDetails(musicIds: string[]): Promise<MusicResponseDto[]> {
        const musicPromises = musicIds.map(async (musicId) => {
            const musicRef = database.ref(`musics/${musicId}`);
            const musicSnap = await musicRef.get();
            const musicData = musicSnap.val();

            if (!musicData) return null;

            return new MusicResponseDto(
                musicSnap.key as string,
                musicData.name,
                musicData.artist,
                musicData.genres,
                musicData.duration,
                musicData.imgPath,
            );
        });

        const results = await Promise.all(musicPromises);
        return results.filter(item => item !== null) as MusicResponseDto[];
    }

    async fetchMusicIdsFromHistory(userId: string, limit: number) {
        const historySnapshot = await firestore
            .collection(`users`)
            .doc(userId)
            .collection('history')
            .orderBy('listenAt', 'desc')
            .limit(limit)
            .get();

        return historySnapshot.empty ? [] : historySnapshot.docs.map(doc => doc.data().musicId);
    }
    async fetchMusicIdsFromArtist(artist: string, limit: number = 20) {
        const musicRef = database.ref('musics');
        const snapshot = await musicRef.orderByChild('artist').equalTo(artist).limitToFirst(limit).get();

        if (!snapshot.exists()) return [];
        return Object.keys(snapshot.val());
    }

    async fetchMusicIdsFromGenres(genreName: string, limit: number = 20) {
        const musicRef = database.ref('musics');
        const snapshot = await musicRef.get();

        if (!snapshot.exists()) return [];

        const musics = snapshot.val();

        console.log(`Searching for genre: "${genreName}"`);

        const filteredMusicIds: string[] = [];

        Object.entries(musics).forEach(([musicId, musicData]: [string, any]) => {
            if (!musicData.genres || !Array.isArray(musicData.genres)) {
                return;
            }

            const hasMatchingGenre = musicData.genres.some((genre: any) => {
                console.log(`Music ${musicId} - comparing genre "${genre.name}" with "${genreName}"`);

                return genre.name.toLowerCase() === genreName.toLowerCase();
            });

            if (hasMatchingGenre) {
                console.log(`Found matching music: ${musicId}`);
                filteredMusicIds.push(musicId);
            }
        });

        const result = filteredMusicIds.slice(0, limit);
        console.log(`Returning ${result.length} music IDs`);

        return result;
    }
    async fetchMusicIdsFromLove(userId: string, limit: number) {
        const historySnapshot = await firestore
            .collection(`users`)
            .doc(userId)
            .collection('love')
            .orderBy('listenAt', 'desc')
            .limit(limit)
            .get();

        return historySnapshot.empty ? [] : historySnapshot.docs.map(doc => doc.data().musicId);
    }

    async getFollowedCount(userId: string) {
        const follow = await generateRepo.getIdsArtistFollowed(userId);
        return follow.length;
    }
}

export default new FetchBase();