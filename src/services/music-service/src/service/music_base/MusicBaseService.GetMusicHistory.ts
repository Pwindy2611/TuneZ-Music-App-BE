import { IMusicBaseService } from "../../interface/IMusicBaseService.js";
import FetchBase from '../../util/base/FetchBase.js'
import {mediator} from "../../config/container/Container.js";
import {GetMusicHistoryQuery} from "../query/GetMusicHistoryQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicHistoryService{
    execute: IMusicBaseService["getMusicHistory"] = async (userId) => {
        return await mediator.send(new GetMusicHistoryQuery(userId));
    }
}

