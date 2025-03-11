import {IMusicStreamService} from "../../interface/service/IMusicStreamService.js";
import {IMusicState} from "../../interface/object/IMusicState.js";
import {Lifecycle, scoped} from "tsyringe";
import {musicStreamMediator} from "../../config/container/Container.js";
import {GetUserMusicStateQuery} from "./query/GetUserMusicStateQuery.js";

@scoped(Lifecycle.ResolutionScoped)
export class GetUserMusicStateService {
    execute: IMusicStreamService['getUserMusicSate'] = async (userId: string): Promise<IMusicState> => {
        return musicStreamMediator.send(new GetUserMusicStateQuery(userId));
    }
}
