import { musicUserMediator} from "../../config/container/Container.js";
import {GetMusicLoveQuery} from "./query/GetMusicLoveQuery.js";
import {singleton} from "tsyringe";
import {IMusicUserService} from "../../interface/service/IMusicUserService.js";
@singleton()
export class GetMusicLoveService {
    execute: IMusicUserService["getMusicLove"] = async (userId) => {
        return await musicUserMediator.send(new GetMusicLoveQuery(userId));
    };
}