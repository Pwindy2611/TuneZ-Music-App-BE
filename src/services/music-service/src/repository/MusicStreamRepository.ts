import {IMusicStreamRepository} from "../interface/repository/IMusicStreamRepository.js";
import {IMusicState} from "../interface/object/IMusicState.js";
import redisClient from "../config/redis/RedisConfig.js";
import {firestore} from "../config/firebase/FireBaseConfig.js";
import {MusicBaseService} from "../service/music_base/MusicBaseService.js";
import {singleton} from "tsyringe";
import {PassThrough, Readable} from "stream";
import axios from "axios";
import {historyServiceClient} from "../grpc/client/GrpcClients.js";


@singleton()
export class MusicStreamRepository implements IMusicStreamRepository {
    async getUserMusicState(userId: string): Promise<IMusicState> {
        const data = await redisClient.get(`musicState:${userId}`);
        if (data) return JSON.parse(data);

        const doc = await firestore
            .collection("users")
            .doc(userId)
            .collection('musicStates')
            .doc('musicState:'+userId)
            .get();

        if (doc.exists) {
            const state = doc.data() as IMusicState;
            await redisClient.set(`musicState:${userId}`, JSON.stringify(state), { EX: 3600 });
            return state;
        }

        return { currentMusicId: null, timestamp: 0, lastUpdated: 0, isPlaying: false};
    }

    async getStreamMusic(musicId: string): Promise<Readable> {
        const musicUrl = await MusicBaseService.getMusicUrlById.execute(musicId);

        const outputStream = new PassThrough();

        let isFirstChunkDone = false;

        try {
            const firstChunk = await axios.get(musicUrl, {
                headers: { Range: "bytes=0-524288" }, // 512KB đầu tiên
                responseType: "stream"
            });

            firstChunk.data.on('end', () => {
                isFirstChunkDone = true;
            });

            firstChunk.data.pipe(outputStream, { end: false });

            const restOfDataPromise = axios.get(musicUrl, {
                headers: { Range: "bytes=524289-" },
                responseType: "stream"
            });

            restOfDataPromise.then(fullResponse => {
                const checkAndPipeRest = () => {
                    if (isFirstChunkDone) {
                        fullResponse.data.pipe(outputStream);
                    } else {
                        setTimeout(checkAndPipeRest, 100);
                    }
                };

                checkAndPipeRest();
            }).catch(error => {
                if (!outputStream.destroyed) {
                    outputStream.end();
                }
            });

            return outputStream;
        } catch (error) {
            console.error("Error streaming music:", error);
            outputStream.end();
            return outputStream;
        }
    }


    async updateUserMusicState(userId: string, state: {}): Promise<void> {
        await redisClient.set(`musicState:${userId}`, JSON.stringify(state), { EX: 3600 });

        setTimeout(async () => {
            await firestore.collection('users').doc(userId).collection('musicStates').doc('musicState:'+userId).set(state);
        }, 300000);
    }

    async calculateCurrentTimestamp(userId: string): Promise<number> {
        const state = await this.getUserMusicState(userId);
        if (!state.currentMusicId) return 0;

        const timeElapsed = (Date.now() - state.lastUpdated) / 1000;

        return state.isPlaying ? state.timestamp + timeElapsed : state.timestamp;
    }

    async incrementPlayCount(musicId: string): Promise<void> {
        const musicRef = firestore.collection('musics').doc(musicId);
        await firestore.runTransaction(async (transaction) => {
            const musicDoc = await transaction.get(musicRef);
            if (!musicDoc.exists) {
                transaction.set(musicRef, { playCount: 1 });
            } else {
                const currentPlayCount = musicDoc.data()?.playCount || 0;
                transaction.update(musicRef, { playCount: currentPlayCount + 1 });
            }
        });
    }

    async saveHistory(userId: string, musicId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            historyServiceClient.addMusicId({ userId, musicId }, (err: any) => {
                if (err) {
                    reject(new Error(`gRPC error: ${err.message}`));
                    return;
                }
                resolve();
            });
        });
    }
}