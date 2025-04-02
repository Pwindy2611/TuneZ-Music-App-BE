import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {singleton} from "tsyringe";
import { musicBaseRepository } from "../../config/container/Container.js";

@singleton()
export class GetAllGenresService {
    execute: IMusicBaseService["getAllGenres"] = async () => {
        return await musicBaseRepository.getAllGenres();
    }
} 