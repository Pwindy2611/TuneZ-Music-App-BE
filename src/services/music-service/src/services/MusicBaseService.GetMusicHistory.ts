import { IMusicBaseService } from "../interface/IMusicBaseService.js";
import { database, firestore } from '../config/firebase/FireBaseConfig.js';
import { GetMusicResponseDto } from '../dto/GetMusicResponseDto.js';

export const getMusicHistory: IMusicBaseService["getMusicHistory"] = async (userId) => {
    try {
        const historySnapshot = await firestore
            .collection(`history`)
            .doc(userId)
            .collection('data')
            .limit(50)
            .get()

        if (historySnapshot.empty) return [];

        const musicIds = historySnapshot.docs.map(doc => doc.data().musicId);
        
        const musicPromises = musicIds.map(async (musicId) => {
            const musicRef = database.ref(`musics/${musicId}`);
            const musicSnap = await  musicRef.get();
            const musicData = musicSnap.val();

            return new GetMusicResponseDto(
                musicData.name,
                musicData.artist,
                musicData.duration,
                musicData.category,
                musicData.loveCount || 0,
                musicData.playCount || 0,
                musicData.musicPath
            );
        });

        return await Promise.all(musicPromises);
    } catch (error) {
        console.error("Error fetching music history:", error);
        throw error;
    }
};
