import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {singleton} from "tsyringe";
import { musicBaseRepository } from "../../config/container/Container.js";

@singleton()
export class GetMusicByCategoryService{
    execute: IMusicBaseService["getMusicByGenres"] = async (category) => {
        return await musicBaseRepository.getMusicByGenres(category);
    }
}