import {Readable} from "stream";
import {IMusicState} from "../object/IMusicState.js";

export interface IMusicStreamRepository {
    getStreamMusic(userId: string, musicId: string): Promise<Readable>
    getUserMusicState(userId: string): Promise<IMusicState>
    updateUserMusicState(userId: string, state: {}): Promise<void>
    calculateCurrentTimestamp(userId: string) : Promise<number>
}