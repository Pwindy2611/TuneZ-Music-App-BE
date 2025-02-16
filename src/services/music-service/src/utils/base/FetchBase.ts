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
                musicData.name,
                musicData.artist,
                musicData.duration,
                musicData.category,
                musicData.loveCount || 0,
                musicData.playCount || 0,
                musicData.musicPath,
                musicData.imgPath,
                musicData.songType,
            );
        });

        const results = await Promise.all(musicPromises);
        return results.filter(item => item !== null) as GetMusicResponseDto[];
    }

    async fetchMusicIdsFromHistory(userId: string, limit: number) {
        const historySnapshot = await firestore
            .collection(`history`)
            .doc(userId)
            .collection('data')
            .orderBy('listendAt', 'desc')
            .limit(limit)
            .get();

        return historySnapshot.empty ? [] : historySnapshot.docs.map(doc => doc.data().musicId);
    }

    async fetchMusicIdsFromLove(userId: string, limit: number) {
        const historySnapshot = await firestore
            .collection(`love`)
            .doc(userId)
            .collection('data')
            .orderBy('listendAt', 'desc')
            .limit(limit)
            .get();

        return historySnapshot.empty ? [] : historySnapshot.docs.map(doc => doc.data().musicId);
    }
    
}

export default new FetchBase();