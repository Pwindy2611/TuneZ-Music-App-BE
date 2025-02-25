import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {mediator} from "../mediator/Container.js";
import {GetAllMusicQuery} from "../query/GetAllMusicQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetAllMusicService {
    execute: IMusicBaseService["getAllMusic"] = async () => {
        try{
            return await mediator.send(new GetAllMusicQuery());
        }catch (error) {
            throw new Error("Error retrieving all music: " + error.message);
        }
    }
}