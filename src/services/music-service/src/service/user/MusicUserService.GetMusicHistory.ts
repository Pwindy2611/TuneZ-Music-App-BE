import { musicUserRepository } from "../../config/container/Container.js";
import {singleton} from "tsyringe";
import {IMusicUserService} from "../../interface/service/IMusicUserService.js";
@singleton()
export class GetMusicHistoryService{
    execute: IMusicUserService["getMusicHistory"] = async (userId) => {
        return await musicUserRepository.getMusicHistory(userId);
    }
}

