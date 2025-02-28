import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {musicBaseMediator} from "../../config/container/Container.js";
import {GetMusicByCategoryQuery} from "./query/GetMusicByCategoryQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicByCategoryService{
    execute: IMusicBaseService["getMusicByCategory"] = async (category) => {
        return await musicBaseMediator.send(new GetMusicByCategoryQuery(category));
    }
}