import {IMusicStreamService} from "../../interface/service/IMusicStreamService.js";
import {Lifecycle, scoped} from "tsyringe";
import { musicStreamRepository } from "../../config/container/Container.js";
@scoped(Lifecycle.ResolutionScoped)
export class GetStreamMusicService {
    execute: IMusicStreamService["getStreamMusic"] = async (musicId: string) => {
        return musicStreamRepository.getStreamMusic(musicId);
    }
}