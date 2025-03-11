import {database, firestore} from '../../config/firebase/FireBaseConfig.js'
import {MusicResponseDto} from "../../dto/response/MusicResponseDto.js";
import axios from "axios";

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

        const response = await axios.get(`http://api-gateway:3000/history/getMusicIdsByUserHistory?userId=${userId}&limit=${limit}`);

        return response.data.data as string[];
    }

    async fetchMusicIdsFromLove(userId: string, limit: number) {
        const response = await axios.get(`http://api-gateway:3000/love/getMusicIdsByUserLove?userId=${userId}&limit=${limit}`);

        return response.data.musicIds as string[];
    }
}

export default new FetchBase();