import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {singleton} from "tsyringe";
import { musicBaseRepository } from "../../config/container/Container.js";

@singleton()
export class GetGenreByIdService {
    execute: IMusicBaseService["getGenreById"] = async (id) => {
        const genre = await musicBaseRepository.getGenreById(id);
        if (!genre) return null;
        
        return {
            id: genre.id,
            name: genre.name
        };
    }
} 