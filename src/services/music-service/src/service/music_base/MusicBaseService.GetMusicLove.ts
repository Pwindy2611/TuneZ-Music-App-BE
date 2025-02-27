import FetchBase from '../../util/base/FetchBase.js'
import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {mediator} from "../../config/container/Container.js";
import {GetMusicLoveQuery} from "../query/GetMusicLoveQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicLoveService {
    execute: IMusicBaseService["getMusicLove"] = async (userId) => {
        return await mediator.send(new GetMusicLoveQuery(userId));
    };
}