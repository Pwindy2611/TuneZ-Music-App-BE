import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseMediator} from "../../config/container/Container.js";
import {GetMusicByIdQuery} from "./query/GetMusicByIdQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicById {
    execute: IMusicBaseService["getMusicById"] = async (id) => {
        return musicBaseMediator.send(new GetMusicByIdQuery(id));
    }
}