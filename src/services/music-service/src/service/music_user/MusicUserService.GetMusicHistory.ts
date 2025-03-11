import { musicUserMediator} from "../../config/container/Container.js";
import {GetMusicHistoryQuery} from "./query/GetMusicHistoryQuery.js";
import {singleton} from "tsyringe";
import {IMusicUserService} from "../../interface/service/IMusicUserService.js";
@singleton()
export class GetMusicHistoryService{
    execute: IMusicUserService["getMusicHistory"] = async (userId) => {
        return await musicUserMediator.send(new GetMusicHistoryQuery(userId));
    }
}

