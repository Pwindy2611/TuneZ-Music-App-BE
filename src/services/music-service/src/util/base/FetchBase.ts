import { database } from '../../config/firebase/FireBaseConfig.js';
import { MusicResponseDto } from "../../dto/response/MusicResponseDto.js";
import { loveServiceClient, historyServiceClient } from '../../grpc/client/GrpcClients.js';

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
        return new Promise((resolve, reject) => {
            historyServiceClient.getMusicIds({ userId, limit }, (err: any, response: any) => {
                if (err) {
                    reject(new Error(`gRPC error: ${err.message}`));
                    return;
                }
                resolve(response.musicIds);
            });
        });
    }

    async fetchMusicIdsFromLove(userId: string, limit: number) {
        return new Promise((resolve, reject) => {
            loveServiceClient.getMusicIds({ userId, limit }, (err: any, response: any) => {
                if (err) {
                    reject(new Error(`gRPC error: ${err.message}`));
                    return;
                }
                resolve(response.musicIds);
            });
        });
    }
}

export default new FetchBase();