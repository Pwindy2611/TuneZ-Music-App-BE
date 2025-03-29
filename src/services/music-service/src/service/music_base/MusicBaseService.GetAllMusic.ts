import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {singleton} from "tsyringe";
import { musicBaseRepository } from "../../config/container/Container.js";

@singleton()
export class GetAllMusicService {
    execute: IMusicBaseService["getAllMusic"] = async () => {
        return await musicBaseRepository.getAllMusic();
    }
}