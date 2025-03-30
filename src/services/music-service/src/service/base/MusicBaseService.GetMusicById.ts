import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {singleton} from "tsyringe";
import { musicBaseRepository } from "../../config/container/Container.js";

@singleton()
export class GetMusicById {
    execute: IMusicBaseService["getMusicById"] = async (id) => {
        return await musicBaseRepository.getMusicById(id);
    }
}