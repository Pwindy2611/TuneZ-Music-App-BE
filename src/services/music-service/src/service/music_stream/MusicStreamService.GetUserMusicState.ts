import {IMusicStreamService} from "../../interface/service/IMusicStreamService.js";
import {IMusicState} from "../../interface/object/IMusicState.js";
import {Lifecycle, scoped} from "tsyringe";
import { musicStreamRepository } from "../../config/container/Container.js";

@scoped(Lifecycle.ResolutionScoped)
export class GetUserMusicStateService {
    execute: IMusicStreamService['getUserMusicSate'] = async (userId: string): Promise<IMusicState> => {
        return musicStreamRepository.getUserMusicState(userId);
    }
}
