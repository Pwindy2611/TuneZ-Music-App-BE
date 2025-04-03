import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {singleton} from "tsyringe";
import { musicBaseRepository } from "../../config/container/Container.js";

@singleton()
export class DeleteGenreService {
    execute: IMusicBaseService["deleteGenre"] = async (genreId: string) => {
        await musicBaseRepository.deleteGenre(genreId);
        return genreId;
    }
} 