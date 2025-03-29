import { musicUserRepository } from "../../config/container/Container.js";
import {singleton} from "tsyringe";
import {IMusicUserService} from "../../interface/service/IMusicUserService.js";
@singleton()
export class GetMusicLoveService {
    execute: IMusicUserService["getMusicLove"] = async (userId) => {
        return await musicUserRepository.getMusicLove(userId);
    };
}