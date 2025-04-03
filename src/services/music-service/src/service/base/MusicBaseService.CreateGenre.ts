import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {scoped, Lifecycle} from "tsyringe";
import { musicBaseRepository } from "../../config/container/Container.js";

@scoped(Lifecycle.ResolutionScoped)
export class CreateGenreService {
    execute: IMusicBaseService["createGenre"] = async (name: string, description?: string) => {
        return await musicBaseRepository.createGenre(name, description);
    }
} 