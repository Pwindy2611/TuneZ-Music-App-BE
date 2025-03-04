import {database, firestore} from '../../config/firebase/FireBaseConfig.js'
import {GetMusicResponseDto} from "../../dto/GetMusicResponseDto.js";

class FetchBase {
    async fetchMusicDetails(musicIds: string[]): Promise<GetMusicResponseDto[]> {
        const musicPromises = musicIds.map(async (musicId) => {
            const musicRef = database.ref(`musics/${musicId}`);
            const musicSnap = await musicRef.get();
            const musicData = musicSnap.val();

            if (!musicData) return null;

            return new GetMusicResponseDto(
                musicSnap.key as string,
                musicData.name,
                musicData.artist,
                musicData.category,
                musicData.duration,
                musicData.imgPath,
            );
        });

        const results = await Promise.all(musicPromises);
        return results.filter(item => item !== null) as GetMusicResponseDto[];
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
    async fetchMusicIdsFromArtist(artist: string, limit: number) {
        const musicRef = database.ref('musics');
        const snapshot = await musicRef.orderByChild('artist').equalTo(artist).limitToFirst(limit).get();

        if (!snapshot.exists()) return [];
        return Object.keys(snapshot.val());
    }
    async fetchMusicIdsFromGenre(genre: string, limit: number) {
        const musicRef = database.ref('musics');
        const snapshot = await musicRef.orderByChild('genre').equalTo(genre).limitToFirst(limit).get();

        if (!snapshot.exists()) return [];
        return Object.keys(snapshot.val());
    }

    async fetchMusicIdsFromCategory(category: string, limit: number) {
        const musicRef = database.ref('musics');
        const snapshot = await musicRef.orderByChild('category').equalTo(category).limitToFirst(limit).get();

        if (!snapshot.exists()) return [];
        return Object.keys(snapshot.val());
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
}

export default new FetchBase();