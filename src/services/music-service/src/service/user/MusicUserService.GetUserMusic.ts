import {singleton} from "tsyringe";
import {IMusicUserService} from "../../interface/service/IMusicUserService.js";
import {musicUserRepository} from "../../config/container/Container.js";

@singleton()
export class GetUserMusicService {
    execute: IMusicUserService["getMusicLove"] = async (userId) => {
        return await musicUserRepository.getUserMusic(userId);
    };
}