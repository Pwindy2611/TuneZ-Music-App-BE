import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {singleton} from "tsyringe";
import { musicBaseRepository } from "../../config/container/Container.js";

@singleton()
export class UpdateGenreService {
    execute: IMusicBaseService["updateGenre"] = async (genreId: string, updateData: any) => {
        await musicBaseRepository.updateGenre(genreId, updateData);
        return genreId;
    }
} 