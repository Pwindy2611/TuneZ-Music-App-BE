import {IMusicState} from "../object/IMusicState.js";
import {Readable} from "stream";

export interface IMusicStreamService {
    getUserMusicSate(userId: string): Promise<IMusicState>
    updateUserMusicState(userId: string, musicId: string, timestamp: number, isPlaying: boolean): Promise<void>
    calculateResumeTimestamp(state: IMusicState): Promise<number>
    getStreamMusic(musicId: string): Promise<Readable>
}