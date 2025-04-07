import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseRepository} from "../../config/container/Container.js";
import { Lifecycle, scoped } from "tsyringe";

@scoped(Lifecycle.ResolutionScoped)
export class DeleteMusicService {
    execute: IMusicBaseService["deleteMusic"] = async (id) => {
        await musicBaseRepository.deleteMusic(id);
        return id;
    };
} 