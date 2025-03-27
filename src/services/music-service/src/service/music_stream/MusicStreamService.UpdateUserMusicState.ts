import {IMusicStreamService} from "../../interface/service/IMusicStreamService.js";
import {Lifecycle, scoped} from "tsyringe";
import {musicStreamRepository} from "../../config/container/Container.js";

@scoped(Lifecycle.ResolutionScoped)
export class UpdateUserMusicStateService {
    execute: IMusicStreamService["updateUserMusicState"] = async (userId: string, musicId: string, timestamp: number, isPlaying: boolean) => {
        const state = { currentMusicId: musicId, timestamp, lastUpdated: Date.now(), isPlaying };
        return musicStreamRepository.updateUserMusicState(userId, state);
    }
}
