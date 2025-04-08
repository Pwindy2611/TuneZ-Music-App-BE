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
                musicId,
                musicData.name,
                musicData.artist,
                musicData.genres,
                musicData.duration,
                musicData.imgPath,
                musicData.lyrics
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

    async fetchMusicIdsFromUser(userId: string, limit: number) {
        return new Promise((resolve, reject) => {
            database.ref(`musics`).orderByChild('userId').equalTo(userId).limitToLast(limit).once('value', (snapshot) => {
                const musicIds: string[] = [];
                snapshot.forEach((childSnapshot) => {
                    musicIds.push(childSnapshot.key as string);
                });
                resolve(musicIds);
            }, (error) => {
                reject(new Error(`Firebase error: ${error.message}`));
            });
        });
    }
}

export default new FetchBase();