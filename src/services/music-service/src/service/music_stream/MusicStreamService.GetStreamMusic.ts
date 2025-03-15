import {IMusicStreamService} from "../../interface/service/IMusicStreamService.js";
import {Lifecycle, scoped} from "tsyringe";
import {musicStreamMediator} from "../../config/container/Container.js";
import {GetStreamMusicQuery} from "./query/GetStreamMusicQuery.js";

@scoped(Lifecycle.ResolutionScoped)
export class GetStreamMusicService {
    execute: IMusicStreamService["getStreamMusic"] = async (musicId: string) => {
        return musicStreamMediator.send(new GetStreamMusicQuery(musicId));
    }
}