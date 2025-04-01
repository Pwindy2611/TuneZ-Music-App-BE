import {Readable} from "stream";
import {IMusicState} from "../object/IMusicState.js";

export interface IMusicStreamRepository {
    getStreamMusic(musicId: string): Promise<Readable>
    getUserMusicState(userId: string): Promise<IMusicState>
    updateUserMusicState(userId: string, state: {}): Promise<void>
    calculateCurrentTimestamp(userId: string) : Promise<number>
    incrementPlayCount(musicId: string): Promise<void>
    saveHistory(userId: string, musicId: string): Promise<void>
}