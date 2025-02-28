import {IMusicRecService} from "../../interface/IMusicRecService.js";
import {musicRecMediator} from "../../config/container/Container.js";
import {GenerateUserPlaylistQuery} from "./query/GenerateUserPlaylistQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GenerateUserPlaylistService {
    execute: IMusicRecService["generateUserPlayList"] = async (userId) => {
        return musicRecMediator.send(new GenerateUserPlaylistQuery(userId));
    }
}