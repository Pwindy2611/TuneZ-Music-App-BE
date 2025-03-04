import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {musicBaseMediator} from "../../config/container/Container.js";
import {GetMusicLoveQuery} from "./query/GetMusicLoveQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicLoveService {
    execute: IMusicBaseService["getMusicLove"] = async (userId) => {
        return await musicBaseMediator.send(new GetMusicLoveQuery(userId));
    };
}