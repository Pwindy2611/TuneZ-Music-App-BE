import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {mediator} from "../mediator/Container.js";
import {GetMusicByCategoryQuery} from "../query/GetMusicByCategoryQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicByCategoryService{
    execute: IMusicBaseService["getMusicByCategory"] = async (category) => {
        return await mediator.send(new GetMusicByCategoryQuery(category));
    }
}