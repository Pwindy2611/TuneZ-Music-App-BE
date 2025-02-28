import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {musicBaseMediator} from "../../config/container/Container.js";
import {GetAllMusicQuery} from "./query/GetAllMusicQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetAllMusicService {
    execute: IMusicBaseService["getAllMusic"] = async () => {
        return await musicBaseMediator.send(new GetAllMusicQuery());
    }
}