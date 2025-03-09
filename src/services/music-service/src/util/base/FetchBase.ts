import {database, firestore} from '../../config/firebase/FireBaseConfig.js'
import {MusicResponseDto} from "../../dto/response/MusicResponseDto.js";

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