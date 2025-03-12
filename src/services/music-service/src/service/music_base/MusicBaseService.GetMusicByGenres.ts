import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseMediator} from "../../config/container/Container.js";
import {GetMusicByGenresQuery} from "./query/GetMusicByGenresQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicByCategoryService{
    execute: IMusicBaseService["getMusicByGenres"] = async (category) => {
        return await musicBaseMediator.send(new GetMusicByGenresQuery(category));
    }
}