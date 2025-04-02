import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {singleton} from "tsyringe";
import { musicBaseRepository } from "../../config/container/Container.js";

@singleton()
export class IsGenreExistService {
    execute: IMusicBaseService["isGenreExist"] = async (genreId: string) => {
        return await musicBaseRepository.isGenreExist(genreId);
    }
} 