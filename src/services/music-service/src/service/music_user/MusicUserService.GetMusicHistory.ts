import {musicBaseMediator} from "../../config/container/Container.js";
import {GetMusicHistoryQuery} from "./query/GetMusicHistoryQuery.js";
import {singleton} from "tsyringe";
import {IMusicUserService} from "../../interface/IMusicUserService.js";
@singleton()
export class GetMusicHistoryService{
    execute: IMusicUserService["getMusicHistory"] = async (userId) => {
        return await musicBaseMediator.send(new GetMusicHistoryQuery(userId));
    }
}

