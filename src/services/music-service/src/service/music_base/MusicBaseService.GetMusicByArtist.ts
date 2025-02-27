import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {mediator} from "../../config/container/Container.js";
import {GetMusicByArtistQuery} from "../query/GetMusicByArtistQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicByArtistService{
    execute: IMusicBaseService["getMusicByArtist"] = async (artist) => {
        return await mediator.send(new GetMusicByArtistQuery(artist));
    };
}
