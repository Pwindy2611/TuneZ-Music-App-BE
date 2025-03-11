import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseMediator} from "../../config/container/Container.js";
import {GetMusicDurationByIdQuery} from "./query/GetMusicDurationByIdQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicDurationByIdService {
    execute: IMusicBaseService["getMusicDurationById"] = async (musicId: string) => {
        return musicBaseMediator.send(new GetMusicDurationByIdQuery(musicId));
    }
}