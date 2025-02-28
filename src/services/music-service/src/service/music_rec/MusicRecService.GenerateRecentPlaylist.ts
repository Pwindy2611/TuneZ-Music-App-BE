import {IMusicRecService} from "../../interface/IMusicRecService.js";
import FetchBase from "../../util/base/FetchBase.js";
import {auth} from "../../config/firebase/FireBaseConfig.js";
import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {musicRecMediator} from "../../config/container/Container.js";
import {GenerateRecentPlaylistQuery} from "./query/GenerateRecentPlaylistQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GenerateRecentPlaylistService{
    execute: IMusicRecService["generateRecentPlaylist"] = async (userId, playlistLimit: number = 20, historyLimit: number = 50) => {
        return await musicRecMediator.send(new GenerateRecentPlaylistQuery(userId, playlistLimit, historyLimit))
    }
}
