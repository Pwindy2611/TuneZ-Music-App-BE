import {IMusicStreamRepository} from "../interface/repository/IMusicStreamRepository.js";
import {IMusicState} from "../interface/object/IMusicState.js";
import {Readable} from "stream";
import redisClient from "../config/redis/RedisConfig.js";
import {firestore} from "../config/firebase/FireBaseConfig.js";
import axios from "axios";
import {MusicBaseService} from "../service/music_base/MusicBaseService.js";
import {singleton} from "tsyringe";
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

    async getStreamMusic(userId: string, musicId: string): Promise<Readable> {
        const musicUrl = await MusicBaseService.getMusicUrlById.execute(musicId);

        const response = await axios.get(musicUrl, {
            responseType: "stream"
        });

        return response.data;
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

}