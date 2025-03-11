import {singleton} from "tsyringe";
import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseMediator} from "../../config/container/Container.js";
import {GetMusicUrlByIdQuery} from "./query/GetMusicUrlByIdQuery.js";

@singleton()
export class GetMusicUrlByIdService {
    execute: IMusicBaseService['getMusicUrlById'] = async (id) => {
        return musicBaseMediator.send(new GetMusicUrlByIdQuery(id));
    }
}